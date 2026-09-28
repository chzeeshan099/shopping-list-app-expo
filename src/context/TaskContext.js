import React, {
  createContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const TaskContext = createContext();

const TASKS_KEY = '@task_manager_tasks';
const DELETED_TASKS_KEY = '@task_manager_deleted_tasks';

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // LOAD DATA
  // --------------------------------

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------
  // SAVE ACTIVE TASKS
  // --------------------------------

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        TASKS_KEY,
        JSON.stringify(tasks)
      ).catch((error) => {
        console.log('Save tasks error:', error);
      });
    }
  }, [tasks, loading]);

  // --------------------------------
  // SAVE DELETED TASKS
  // --------------------------------

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        DELETED_TASKS_KEY,
        JSON.stringify(deletedTasks)
      ).catch((error) => {
        console.log(
          'Save deleted tasks error:',
          error
        );
      });
    }
  }, [deletedTasks, loading]);

  // --------------------------------
  // LOAD BOTH
  // --------------------------------

  const loadData = async () => {
    try {
      const storedTasks =
        await AsyncStorage.getItem(
          TASKS_KEY
        );

      const storedDeletedTasks =
        await AsyncStorage.getItem(
          DELETED_TASKS_KEY
        );

      if (storedTasks) {
        setTasks(
          JSON.parse(storedTasks)
        );
      }

      if (storedDeletedTasks) {
        setDeletedTasks(
          JSON.parse(storedDeletedTasks)
        );
      }
    } catch (error) {
      console.log(
        'Load data error:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // ADD TASK
  // --------------------------------

  const addTask = ({
    title,
    description,
    priority,
    dueDate,
  }) => {
    const newTask = {
      id: Date.now().toString(),

      title: title.trim(),

      description:
        description.trim(),

      priority:
        priority || 'medium',

      dueDate:
        dueDate || null,

      completed: false,

      important: false,

      createdAt:
        new Date().toISOString(),
    };

    setTasks((prev) => [
      newTask,
      ...prev,
    ]);
  };

  // --------------------------------
  // UPDATE TASK
  // --------------------------------

  const updateTask = (
    id,
    {
      title,
      description,
      priority,
      dueDate,
    }
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,

              title:
                title.trim(),

              description:
                description.trim(),

              priority,

              dueDate,
            }
          : task
      )
    );
  };

  // --------------------------------
  // DELETE TASK → HISTORY
  // --------------------------------

  const deleteTask = (id) => {
    const taskToDelete =
      tasks.find(
        (task) => task.id === id
      );

    if (!taskToDelete) {
      return;
    }

    const deletedTask = {
      ...taskToDelete,

      deletedAt:
        new Date().toISOString(),
    };

    // Remove from active tasks
    setTasks((prev) =>
      prev.filter(
        (task) => task.id !== id
      )
    );

    // Add to history
    setDeletedTasks((prev) => [
      deletedTask,
      ...prev,
    ]);
  };

  // --------------------------------
  // PERMANENT DELETE
  // --------------------------------

  const permanentlyDeleteTask = (
    id
  ) => {
    setDeletedTasks((prev) =>
      prev.filter(
        (task) => task.id !== id
      )
    );
  };

  // --------------------------------
  // RESTORE TASK
  // --------------------------------

  const restoreTask = (id) => {
    const taskToRestore =
      deletedTasks.find(
        (task) => task.id === id
      );

    if (!taskToRestore) {
      return;
    }

    const restoredTask = {
      ...taskToRestore,
    };

    delete restoredTask.deletedAt;

    setTasks((prev) => [
      restoredTask,
      ...prev,
    ]);

    setDeletedTasks((prev) =>
      prev.filter(
        (task) => task.id !== id
      )
    );
  };

  // --------------------------------
  // TOGGLE COMPLETE
  // --------------------------------

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      )
    );
  };

  // --------------------------------
  // TOGGLE IMPORTANT
  // --------------------------------

  const toggleImportant = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              important:
                !task.important,
            }
          : task
      )
    );
  };

  // --------------------------------
  // GET TASK
  // --------------------------------

  const getTask = (id) => {
    return tasks.find(
      (task) => task.id === id
    );
  };

  // --------------------------------
  // GET DELETED TASK
  // --------------------------------

  const getDeletedTask = (id) => {
    return deletedTasks.find(
      (task) => task.id === id
    );
  };

  // --------------------------------
  // STATISTICS
  // --------------------------------

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) => !task.completed
    ).length;

  const importantTasks =
    tasks.filter(
      (task) => task.important
    ).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  return (
    <TaskContext.Provider
      value={{
        // Active tasks
        tasks,
        loading,

        addTask,
        updateTask,
        deleteTask,

        toggleTask,
        toggleImportant,

        getTask,

        // History
        deletedTasks,
        permanentlyDeleteTask,
        restoreTask,
        getDeletedTask,

        // Statistics
        totalTasks,
        completedTasks,
        pendingTasks,
        importantTasks,
        completionPercentage,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}