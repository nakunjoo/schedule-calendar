// db.ts
import { OptionState } from "@/stores/slices/option-slices";
import { CategoryData } from "@/stores/slices/category-slices";
import { ScheduleData } from "@/stores/slices/schedule-slices";
let version = 1;

export interface User {
  id: string;
  name: string;
  email: string;
}

export enum Stores {
  Options = "Options",
  Category = "Category",
  Schedule = "Schedule",
}

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    const request = indexedDB.open("myDB");

    request.onerror = (e) => {
      console.log("error:", e);
      resolve(false);
    };

    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      // if the data object store doesn't exist, create it
      console.log("Creating Options store");

      db.createObjectStore(Stores.Category, { keyPath: "id" });
      db.createObjectStore(Stores.Schedule, { keyPath: "DATE" });
      db.createObjectStore(Stores.Options, { keyPath: "id" });
      // no need to resolve here
    };

    request.onsuccess = () => {
      console.log("db open");
      resolve(true);
    };
  });
};

export const getOptionDBData = async (option: OptionState) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = async () => {
      const db = request.result;
      const optionTransaction = db.transaction(Stores.Options, "readonly");
      const optionDB = optionTransaction.objectStore(Stores.Options);
      const options = optionDB.get("");
      options.onsuccess = async (e: any) => {
        let value = e.target.result;
        if (!value) {
          resolve(await addOptionDBData(option));
        } else {
          resolve(value);
        }
      };
      options.onerror = (e) => {
        console.log("error", e);
      };

      optionTransaction.oncomplete = () => {
        db.close();
      };
    };
    request.onerror = (e) => {
      console.log("error:", e);
    };
  });
};

export const addOptionDBData = async (option: OptionState) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("myDB");

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(Stores.Options, "readwrite");
      const objectStore = transaction.objectStore(Stores.Options);
      const optionPut = objectStore.put(option);
      optionPut.onsuccess = () => {
        console.log("data added!");
      };

      optionPut.onerror = (err: any) => {
        console.log("error", err);
      };

      transaction.oncomplete = () => {
        db.close();
        resolve(null);
      };
    };
    request.onerror = (e) => {
      console.log("error:", e);
    };
  });
};

// category

export const getCategoryDB = async () => {
  return new Promise<CategoryData[] | null>((resolve) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = async () => {
      const db = request.result;
      const transaction = db.transaction(Stores.Category, "readonly");
      const objectStore = transaction.objectStore(Stores.Category);
      const category = objectStore.getAll();
      category.onsuccess = async (e: any) => {
        let value = e.target.result;
        if (value.length === 0) {
          resolve(null);
        } else {
          resolve(value);
        }
      };
      category.onerror = (e) => {
        console.log("error", e);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
    request.onerror = (e) => {
      console.log("error:", e);
    };
  });
};

export const addCategoryDBData = async (category: CategoryData) => {
  return new Promise((resolve) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(Stores.Category, "readwrite");
      const objectStore = transaction.objectStore(Stores.Category);
      const categoryPut = objectStore.put(category);
      categoryPut.onsuccess = () => {
        console.log("categoryData added!");
      };

      categoryPut.onerror = (err: any) => {
        console.log("error", err);
      };

      transaction.oncomplete = () => {
        db.close();
        resolve(null);
      };
    };
    request.onerror = (e) => {
      console.log("error:", e);
    };
  });
};

export const deleteCategoryDB = async (id: string) => {
  const request = indexedDB.open("myDB");
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(Stores.Category, "readwrite");
    const objectStore = transaction.objectStore(Stores.Category);
    const categoryPut = objectStore.delete(id);
    categoryPut.onsuccess = () => {
      console.log("categoryData added!");
    };

    categoryPut.onerror = (err: any) => {
      console.log("error", err);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  };
  request.onerror = (e) => {
    console.log("error:", e);
  };
};

// schedule

type addScheduleData = {
  DATE: string;
  schedule: ScheduleData[];
};

export const getScheduleDB = async (currentDate: string) => {
  return new Promise<addScheduleData | null>((resolve) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = async () => {
      const db = request.result;
      const transaction = db.transaction(Stores.Schedule, "readonly");
      const objectStore = transaction.objectStore(Stores.Schedule);
      const schedule = objectStore.get(currentDate);
      schedule.onsuccess = async (e: any) => {
        let value = e.target.result;
        if (!value) {
          resolve(null);
        } else {
          resolve(value);
        }
      };
      schedule.onerror = (e) => {
        console.log("error", e);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
    request.onerror = (e) => {
      console.log("error:", e);
    };
  });
};

export const addScheduleDBData = async (
  currentDate: string,
  schedule: addScheduleData
) => {
  return new Promise(async (resolve) => {
    const request = indexedDB.open("myDB");
    request.onsuccess = async () => {
      const db = request.result;
      const getData = await getScheduleDB(currentDate);
      const transaction = db.transaction(Stores.Schedule, "readwrite");
      const objectStore = transaction.objectStore(Stores.Schedule);
      if (!getData) {
        const schedulePut = objectStore.put(schedule);
        schedulePut.onsuccess = () => {
          console.log("scheduleData added!");
        };

        schedulePut.onerror = (err: any) => {
          console.log("error", err);
        };

        transaction.oncomplete = () => {
          db.close();
          resolve(null);
        };
      } else {
        const putData = {
          DATE: getData.DATE,
          schedule: [...getData.schedule, ...schedule.schedule],
        };
        const schedulePut = objectStore.put(putData);
        schedulePut.onsuccess = () => {
          console.log("scheduleData added!");
        };

        schedulePut.onerror = (err: any) => {
          console.log("error", err);
        };

        transaction.oncomplete = () => {
          db.close();
          resolve(null);
        };
      }
    };
    request.onerror = (e) => {
      console.log("error:", e);
    };
  });
};

export const deleteScheduleDB = async (date: string, id: string) => {
  const request = indexedDB.open("myDB");
  request.onsuccess = async () => {
    const db = request.result;
    const transaction = db.transaction(Stores.Schedule, "readwrite");
    const objectStore = transaction.objectStore(Stores.Schedule);
    const schedule = objectStore.get(date);
    schedule.onsuccess = async (e: any) => {
      let value = e.target.result;
      if (value) {
        const newArr = [];
        for (const schedule of value.schedule) {
          if (schedule.id !== id) {
            console.log("push");
            newArr.push(schedule);
          }
        }
        value.schedule = newArr;

        const putSchedule = objectStore.put(value);

        putSchedule.onsuccess = () => {
          console.log("update-schedule");
        };
        putSchedule.onerror = (err) => {
          console.log("error-put", err);
        };
        transaction.oncomplete = () => {
          db.close();
        };
      }
    };
    schedule.onerror = (e) => {
      console.log("error", e);
    };
  };
  request.onerror = (e) => {
    console.log("error:", e);
  };
};
