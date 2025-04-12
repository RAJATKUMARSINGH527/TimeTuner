import { useState, useEffect } from 'react';
import { BarChart3, Settings, PlusCircle, Menu, CheckCircle, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PomofocusApp() {
  const [timerMode, setTimerMode] = useState('pomodoro'); 
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  
  const modes = {
    pomodoro: { 
      name: 'Pomodoro', 
      duration: 25 * 60, 
      bgColor: 'bg-red-600', 
      accentColor: 'bg-red-700',
      buttonTextColor: 'text-red-600'
    },
    shortBreak: { 
      name: 'Short Break', 
      duration: 5 * 60, 
      bgColor: 'bg-sky-500', 
      accentColor: 'bg-sky-600',
      buttonTextColor: 'text-sky-500'
    },
    longBreak: { 
      name: 'Long Break', 
      duration: 15 * 60, 
      bgColor: 'bg-blue-700', 
      accentColor: 'bg-blue-800',
      buttonTextColor: 'text-blue-700'
    }
  };
  
  // Load stored data on initial render
  useEffect(() => {
    const storedTasks = localStorage.getItem('pomodoroTasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    
    const storedSession = localStorage.getItem('pomodoroSession');
    if (storedSession) {
      setCurrentSession(parseInt(storedSession));
    }
  }, []);
  
  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('pomodoroSession', currentSession.toString());
  }, [currentSession]);
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Play sound
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Handle session completion
      if (timerMode === 'pomodoro') {
        if (currentSession % 4 === 0) {
          setTimerMode('longBreak');
          setTimeLeft(modes.longBreak.duration);
        } else {
          setTimerMode('shortBreak');
          setTimeLeft(modes.shortBreak.duration);
        }
        setCurrentSession(currentSession + 1);
      } else {
        setTimerMode('pomodoro');
        setTimeLeft(modes.pomodoro.duration);
      }
      
      // Show browser notification if allowed
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: timerMode === 'pomodoro' ? 'Break time!' : 'Time to focus!',
          icon: '/favicon.ico'
        });
      }
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode, currentSession]);
  
  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    // Update document title when timer is running
    if (!isRunning) {
      document.title = `${formatTime(timeLeft)} - Pomofocus`;
    } else {
      document.title = 'Pomofocus';
    }
  };
  
  const changeMode = (mode) => {
    setTimerMode(mode);
    setTimeLeft(modes[mode].duration);
    setIsRunning(false);
    document.title = 'Pomofocus';
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now(),
        text: newTask,
        completed: false,
        pomodoros: 0
      }]);
      setNewTask('');
      setIsAddingTask(false);
    }
  };
  
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, completed: !task.completed} : task
    ));
  };
  
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const startEditingTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };
  
  const saveEditedTask = () => {
    if (editingTaskText.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTaskId ? {...task, text: editingTaskText} : task
      ));
      setEditingTaskId(null);
      setEditingTaskText('');
    }
  };
  
  const incrementPomodoro = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, pomodoros: task.pomodoros + 1} : task
    ));
  };
  
  return (
    <div className={`min-h-screen ${modes[timerMode].bgColor} transition-colors duration-500`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-white text-2xl font-bold">Pomofocus</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-red-500 bg-opacity-20 rounded-md text-white hover:bg-opacity-30 transition-colors">
              <span className="flex items-center gap-1">
                <BarChart3 size={16} />
                <span>Report</span>
              </span>
            </button>
            <button className="px-3 py-2 bg-red-500 bg-opacity-20 rounded-md text-white hover:bg-opacity-30 transition-colors">
              <span className="flex items-center gap-1">
                <Settings size={16} />
                <span>Setting</span>
              </span>
            </button>
            <Link to="/login" className="flex items-center gap-1">
            <button className="px-3 py-2 bg-red-500 bg-opacity-20 rounded-md text-white hover:bg-opacity-30 transition-colors">
              <span>Sign In</span>
            </button>
            </Link>
            <button className="px-3 py-2 bg-red-500 bg-opacity-20 rounded-md text-white hover:bg-opacity-30 transition-colors">
              <Menu size={16} />
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="mt-8 max-w-md mx-auto">
          {/* Timer Container */}
          <div className={`${modes[timerMode].bgColor} bg-opacity-30 rounded-lg p-6 transition-colors duration-500`}>
            {/* Timer Mode Selector */}
            <div className="flex justify-center mb-6" >
              <div className="flex justify-center gap-2">
                <button 
                  className={`py-2 px-4 rounded-md transition-colors duration-300 ${
                    timerMode === 'pomodoro' 
                      ? `${modes.pomodoro.accentColor} text-white font-medium` 
                      : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-10'
                  }`}
                  onClick={() => changeMode('pomodoro')}
                >
                  Pomodoro
                </button>
                <button 
                  className={`py-2 px-4 rounded-md transition-colors duration-300 ${
                    timerMode === 'shortBreak' 
                      ? `${modes.shortBreak.accentColor} text-white font-medium` 
                      : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-10'
                  }`}
                  onClick={() => changeMode('shortBreak')}
                >
                  Short Break
                </button>
                <button 
                  className={`py-2 px-4 rounded-md transition-colors duration-300 ${
                    timerMode === 'longBreak' 
                      ? `${modes.longBreak.accentColor} text-white font-medium` 
                      : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-10'
                  }`}
                  onClick={() => changeMode('longBreak')}
                >
                  Long Break
                </button>
              </div>
            </div>
            
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-8xl font-bold text-white mb-8">
                {formatTime(timeLeft)}
              </div>
              
              {/* Timer Controls */}
              <button 
                className={`px-16 py-3 bg-white rounded-md font-bold text-xl transition-colors duration-300 ${modes[timerMode].buttonTextColor} hover:opacity-90`}
                onClick={toggleTimer}
              >
                {isRunning ? 'PAUSE' : 'START'}
              </button>
            </div>
          </div>
          
          {/* Session Info */}
          <div className="mt-4 text-center text-white">
            <p>#{currentSession}</p>
            <p className="font-medium">
              {timerMode === 'pomodoro' ? 'Time to focus!' : 'Time for a break!'}
            </p>
          </div>
          
          {/* Tasks */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-white text-xl">Tasks</h2>
              <button className="text-white p-1 rounded hover:bg-white hover:bg-opacity-10">
                <Menu size={16} />
              </button>
            </div>
            
            {/* Task List */}
            {tasks.length > 0 && (
              <div className="mt-2 bg-white bg-opacity-10 rounded-md overflow-hidden">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border-b border-white border-opacity-10 last:border-b-0">
                    {editingTaskId === task.id ? (
                      <div className="flex">
                        <input
                          type="text"
                          value={editingTaskText}
                          onChange={(e) => setEditingTaskText(e.target.value)}
                          className="flex-grow bg-white bg-opacity-20 rounded-md p-2 text-white outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && saveEditedTask()}
                          autoFocus
                        />
                        <button 
                          onClick={saveEditedTask}
                          className="ml-2 px-3 py-1 bg-white bg-opacity-20 rounded-md text-white hover:bg-opacity-30"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="mr-3 text-white"
                          >
                            <CheckCircle size={20} className={task.completed ? 'opacity-100' : 'opacity-30'} />
                          </button>
                          <span className={`text-white ${task.completed ? 'line-through opacity-60' : ''}`}>
                            {task.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-opacity-80 text-sm">
                            {task.pomodoros > 0 && `${task.pomodoros} pomodoros`}
                          </span>
                          <button 
                            onClick={() => startEditingTask(task)}
                            className="p-1 text-white opacity-60 hover:opacity-100"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-white opacity-60 hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Add Task */}
            {isAddingTask ? (
              <div className="mt-2 bg-white bg-opacity-10 rounded-md p-4">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What are you working on?"
                  className="w-full bg-white bg-opacity-20 rounded-md p-3 text-gray placeholder-white placeholder-opacity-60 outline-none mb-3"
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  autoFocus
                />
                <div className="flex justify-between">
                  <button 
                    onClick={() => setIsAddingTask(false)}
                    className="px-4 py-2 opacity-80 hover:opacity-100"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addTask}
                    className={`px-4 py-2 bg-white rounded-md ${modes[timerMode].buttonTextColor} font-medium`}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="w-full flex items-center justify-center gap-2 py-4 mt-2 text-white border border-dashed border-gray border-opacity-50 rounded-md hover:bg-red-500 hover:bg-opacity-10 transition-colors duration-300"
                onClick={() => setIsAddingTask(true)}
              >
                <PlusCircle size={16} />
                <span>Add Task</span>
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}