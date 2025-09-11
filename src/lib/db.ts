// db.ts - Supabase version
import { supabase } from './supabase';
import { OptionState } from "@/stores/slices/option-slices";
import { CategoryData } from "@/stores/slices/category-slices";
import { ScheduleData } from "@/stores/slices/schedule-slices";

export interface User {
  id: string;
  name: string;
  email: string;
}

// No longer needed with Supabase - database initialization is handled by Supabase
export const initDB = (): Promise<boolean> => {
  return Promise.resolve(true);
};

export const getOptionDBData = async (option: OptionState): Promise<OptionState> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return option;
    }

    const { data, error } = await supabase
      .from('options')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.log('error', error);
      return option;
    }

    if (!data) {
      // If no options exist, create default options
      await addOptionDBData(option);
      return option;
    }

    // Map database fields to OptionState format
    return {
      id: data.id,
      themeColor: data.theme_color,
      bgColor: data.bg_color,
      language: data.language,
      holiday: data.holiday,
      anniversary: data.anniversary,
      exquisiteness: data.exquisiteness,
      lunar: data.lunar,
    };
  } catch (error) {
    console.log('error:', error);
    return option;
  }
};

export const addOptionDBData = async (option: OptionState): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('options')
      .upsert({
        user_id: user.id, // Let database generate UUID automatically
        calendar_view: 'month',
        theme: 'light',
        theme_color: option.themeColor,
        bg_color: option.bgColor,
        language: option.language,
        holiday: option.holiday,
        anniversary: option.anniversary,
        exquisiteness: option.exquisiteness,
        lunar: option.lunar,
      } as any, {
        onConflict: 'user_id' // Use user_id for conflict resolution instead of id
      });

    if (error) {
      console.log('error', error);
    } else {
      console.log('options data added!');
    }
  } catch (error) {
    console.log('error:', error);
  }
};

// category

export const getCategoryDB = async (): Promise<CategoryData[] | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('error', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      color: item.color,
    }));
  } catch (error) {
    console.log('error:', error);
    return null;
  }
};

export const addCategoryDBData = async (category: CategoryData): Promise<CategoryData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: category.name,
        color: category.color,
      } as any) // Type assertion to bypass TypeScript issue
      .select()
      .single();

    if (error) {
      console.log('error adding category:', error);
      return null;
    } else {
      console.log('categoryData added!', data);
      return {
        id: data.id,
        name: data.name,
        color: data.color,
      };
    }
  } catch (error) {
    console.log('error:', error);
    return null;
  }
};

export const deleteCategoryDB = async (id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.log('error', error);
    } else {
      console.log('categoryData deleted!');
    }
  } catch (error) {
    console.log('error:', error);
  }
};

// schedule

type addScheduleData = {
  DATE: string;
  schedule: ScheduleData[];
};

export const getScheduleDB = async (currentDate: string): Promise<addScheduleData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return null;
    }

    console.log('Getting schedules for month:', currentDate);

    // If currentDate is YYYY-MM format, search for all dates in that month
    let query = supabase
      .from('schedules')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('user_id', user.id);

    if (currentDate.length === 7) { // YYYY-MM format
      // 해당 월에 시작하거나, 해당 월에 끝나거나, 해당 월을 포함하는 일정을 모두 조회
      const monthStart = `${currentDate}-01`;
      const monthEnd = `${currentDate}-31`; // 간단하게 31일로 설정 (실제로는 해당 월의 마지막 날짜)
      
      query = query.or(
        `date.like.${currentDate}%,` +
        `start_date.like.${currentDate}%,` +
        `end_date.like.${currentDate}%,` +
        `and(start_date.lte.${monthEnd},end_date.gte.${monthStart})`
      );
    } else { // YYYY-MM-DD format
      query = query.eq('date', currentDate);
    }

    const { data, error } = await query;

    if (error) {
      console.log('error loading schedules:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No schedules found for:', currentDate);
      return null;
    }

    console.log('Loaded schedules:', data);

    // Convert database format to application format
    const schedules: ScheduleData[] = data.map(item => ({
      id: item.id,
      type: item.type || 'schedule',
      turn: item.turn || 0,
      title: item.title,
      startDate: item.start_date || item.date,
      endDate: item.end_date || item.date,
      category: {
        id: item.categories?.id || '',
        name: item.categories?.name || '',
        color: item.categories?.color || '#000000',
      },
      memo: item.description || '',
      start: item.start_time || '',
      end: item.end_time || '',
    }));

    return {
      DATE: currentDate,
      schedule: schedules,
    };
  } catch (error) {
    console.log('error:', error);
    return null;
  }
};

export const addScheduleDBData = async (
  currentDate: string,
  schedule: addScheduleData
): Promise<ScheduleData[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return [];
    }

    console.log('Adding schedule for date:', currentDate);
    console.log('Schedule data:', schedule);

    // Convert ScheduleData format to database format
    const scheduleInserts = schedule.schedule.map(item => {
      const startDate = item.startDate || item.start;
      const endDate = item.endDate || item.end;
      
      return {
        user_id: user.id,
        date: startDate ? startDate.split(' ')[0] : currentDate, // Extract date part (YYYY-MM-DD)
        title: item.title,
        start_time: startDate ? startDate.split(' ')[1] || '00:00' : '00:00', // Extract time part or default
        end_time: endDate ? endDate.split(' ')[1] || '23:59' : '23:59', // Extract time part or default
        category_id: (item.category && item.category.id) ? item.category.id : null, // Handle empty category properly
        description: item.memo || '',
        type: item.type || 'schedule',
        turn: item.turn || 0,
        start_date: startDate,
        end_date: endDate,
      };
    });

    console.log('Processed schedule inserts:', scheduleInserts);

    const { data, error } = await supabase
      .from('schedules')
      .insert(scheduleInserts as any) // Type assertion to bypass TypeScript issue
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `);

    if (error) {
      console.log('error adding schedule:', error);
      return [];
    } else {
      console.log('scheduleData added successfully!', data);
      
      // Convert back to ScheduleData format
      return data.map(item => ({
        id: item.id,
        type: item.type || 'schedule',
        turn: item.turn || 0,
        title: item.title,
        startDate: item.start_date || item.date,
        endDate: item.end_date || item.date,
        category: {
          id: item.categories?.id || '',
          name: item.categories?.name || '',
          color: item.categories?.color || '#000000',
        },
        memo: item.description || '',
        start: item.start_time || '',
        end: item.end_time || '',
      }));
    }
  } catch (error) {
    console.log('error:', error);
    return [];
  }
};

export const updateScheduleDBData = async (
  scheduleId: string,
  schedule: ScheduleData
): Promise<ScheduleData | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return null;
    }

    const startDate = schedule.startDate || schedule.start;
    const endDate = schedule.endDate || schedule.end;
    
    const updateData = {
      date: startDate ? startDate.split(' ')[0] : new Date().toISOString().split('T')[0],
      title: schedule.title,
      start_time: startDate ? startDate.split(' ')[1] || '00:00' : '00:00',
      end_time: endDate ? endDate.split(' ')[1] || '23:59' : '23:59',
      category_id: (schedule.category && schedule.category.id) ? schedule.category.id : null,
      description: schedule.memo || '',
      type: schedule.type || 'schedule',
      turn: schedule.turn || 0,
      start_date: startDate,
      end_date: endDate,
    };

    const { data, error } = await supabase
      .from('schedules')
      .update(updateData as any)
      .eq('id', scheduleId)
      .eq('user_id', user.id)
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      console.log('error updating schedule:', error);
      return null;
    } else {
      console.log('schedule updated successfully!', data);
      
      // Convert back to ScheduleData format
      return {
        id: data.id,
        type: data.type || 'schedule',
        turn: data.turn || 0,
        title: data.title,
        startDate: data.start_date || data.date,
        endDate: data.end_date || data.date,
        category: {
          id: data.categories?.id || '',
          name: data.categories?.name || '',
          color: data.categories?.color || '#000000',
        },
        memo: data.description || '',
        start: data.start_time || '',
        end: data.end_time || '',
      };
    }
  } catch (error) {
    console.log('error:', error);
    return null;
  }
};

export const deleteScheduleDB = async (_date: string, id: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.log('error', error);
    } else {
      console.log('schedule deleted!');
    }
  } catch (error) {
    console.log('error:', error);
  }
};
