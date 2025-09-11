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
        id: option.id || '',
        user_id: user.id,
        calendar_view: 'month',
        theme: 'light',
        theme_color: option.themeColor,
        bg_color: option.bgColor,
        language: option.language,
        holiday: option.holiday,
        anniversary: option.anniversary,
        exquisiteness: option.exquisiteness,
        lunar: option.lunar,
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

export const addCategoryDBData = async (category: CategoryData): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .insert({
        id: category.id,
        user_id: user.id,
        name: category.name,
        color: category.color,
      });

    if (error) {
      console.log('error', error);
    } else {
      console.log('categoryData added!');
    }
  } catch (error) {
    console.log('error:', error);
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

    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        categories (
          id,
          name,
          color
        )
      `)
      .eq('date', currentDate)
      .eq('user_id', user.id);

    if (error) {
      console.log('error', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

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
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user');
      return;
    }

    // Convert ScheduleData format to database format
    const scheduleInserts = schedule.schedule.map(item => ({
      id: item.id,
      user_id: user.id,
      date: currentDate,
      title: item.title,
      start_time: item.start,
      end_time: item.end,
      category_id: item.category.id,
      description: item.memo,
      type: item.type,
      turn: item.turn,
      start_date: item.startDate,
      end_date: item.endDate,
    }));

    const { error } = await supabase
      .from('schedules')
      .insert(scheduleInserts);

    if (error) {
      console.log('error', error);
    } else {
      console.log('scheduleData added!');
    }
  } catch (error) {
    console.log('error:', error);
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
