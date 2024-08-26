import axios from "axios";
import { Circle, CircleCheck, Loader2Icon, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

interface TodoList {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  description: string;
}
const App = () => {
  const refs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  const [loading, setLoading] = useState(false)
  const priority = [
    { id: (Math.ceil(Math.random() * 500) + 100).toString(), value: 'High', color: 'bg-danger' },
    { id: (Math.ceil(Math.random() * 500) + 100).toString(), value: 'Medium', color: 'bg-warning' },
    { id: (Math.ceil(Math.random() * 500) + 100).toString(), value: 'Low', color: 'bg-info' },
  ]
  const [data, setData] = useState({
    priority: priority[2].value,
    title: "",
    completed: false
  })
  const [todoList, setTodo] = useState<TodoList[]>([])
  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}`)
      console.log(res.data)
      setTodo(res.data)
      setTimeout(() => {
        setLoading(false)

      }, 700);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const handleHover = (index: string) => {
    const spanElement = refs.current[index];
    if (spanElement) {
      spanElement.style.opacity = "1";
    }
  };

  const handleMouseLeave = (index: string) => {
    const spanElement = refs.current[index];
    if (spanElement) {
      spanElement.style.opacity = "0";
    }
  };

  const handelUpdate = async (item: TodoList) => {
    try {
      setLoading(true)
      await axios.put(`${import.meta.env.VITE_BASE_URL}/${item.id}`, item)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handelSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (data.title.trim() === '') {
      alert('Please enter a task title.')
      return
    }
    try {
      setLoading(true)
      await axios.post(`${import.meta.env.VITE_BASE_URL}`, data)
      setData({ ...data, title: '' })
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  const handelDelete = async (id: string) => {
    try {
      setLoading(true)
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/${id}`)
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="bg-[#987EFF] h-screen text-white font-Poppins font-normal flex flex-col gap-8 justify-center items-center">
      <h1 className="text-5xl font-semibold capitalize">to do list</h1>
      <div className="h-fit bg-white rounded-2xl p-3">
        <div className="bg-[#987EFF] w-[50rem] p-10 flex flex-col justify-center items-center h-full rounded-2xl space-y-20 ">
          <h1 className="text-4xl capitalize font-bold">today main focus</h1>
          <div className="flex flex-col items-center gap-y-10">
            <form className="relative flex justify-center items-center scale-125" onSubmit={handelSubmit}>
              <input className="p-4 w-[35rem] rounded-lg placeholder:capitalize outline-none text-black" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} type="text" placeholder="what is your next task?" />
              <div className="absolute right-2 z-10 flex gap-1 items-center">
                {priority.map((item) =>
                  <div key={item.id}
                    onMouseEnter={() => handleHover(item.id)}
                    onMouseLeave={() => handleMouseLeave(item.id)}
                    onClick={() => setData({ ...data, priority: item.value })}

                    className={`cursor-pointer relative w-6 rounded-full h-6 hover:${item.color}/30  ${item.value == data.priority && `${item.color} bg-opacity-30`} duration-300 p-2 flex justify-center items-center`}>
                    <div className={`${item.color} w-full h-full rounded-full p-1.5 cursor-pointer `}></div>
                    <span
                      className={`absolute bottom-7 duration-300 font-medium text-xs p-2 rounded-md ${item.color} bg-opacity-80 backdrop-blur-md opacity-0`}
                      ref={(el) => {
                        if (el) {
                          refs.current[item.id] = el;
                        }
                      }}>{item.value}</span>
                  </div>
                )
                }
                <button className={`font-medium w-28 mx-2 rounded-md p-1 capitalize bg-[#987EFF] ${data.title ? "duration-1000" : "hidden"}`}>
                  save
                </button>

              </div>
            </form>
            <div className="w-full px-20 py-5 h-96 space-y-8 overflow-y-scroll scroll">
              {loading ?
                <div className="flex justify-center animate-spin">
                  <Loader2Icon size={50} />
                </div>
                :
                todoList.map((item) =>
                  <div key={item.id} className={`bg- flex justify-between ${item.completed && "line-through"} items-center relative bg-white p-4 w-[35rem] scale-110 rounded-lg placeholder:capitalize outline-none text-black z-10`}>
                    <div className="flex gap-x-3 items-center">
                      <div
                        onMouseEnter={() => handleHover(item.id)}
                        onMouseLeave={() => handleMouseLeave(item.id)}
                        className={`text-white cursor-pointer relative w-6 rounded-full h-6 hover:${priority.find(pr => pr.value == item.priority)?.color}/30 duration-300 p-2 flex justify-center items-center z-50`}>
                        <div className={`${priority.find(pr => pr.value == item.priority)?.color} w-full h-full rounded-full p-1.5 cursor-pointer `}></div>
                        <span
                          className={`absolute right-0 z-50 duration-300 font-medium text-xs p-2 rounded-md ${priority.find(pr => pr.value == item.priority)?.color} opacity-0`}
                          ref={(el) => {
                            if (el) {
                              refs.current[item.id] = el;
                            }
                          }}>{item.priority}</span>
                      </div>
                      <p className=" text-slate-500 font-Poppins font-medium">{item.title}</p>
                    </div>
                    <div className="flex items-center justify-center gap-x-5">

                      <button onMouseEnter={() => handleHover((item.id + Math.ceil(Math.random() + 500)).toString())}
                        onMouseLeave={() => handleMouseLeave((item.id + Math.ceil(Math.random() + 500)).toString())} className="relative flex flex-col justify-center items-center" onClick={() => handelUpdate({ ...item, completed: !item.completed })}>
                        {
                          item.completed ?
                            <CircleCheck color="#987EFF" strokeWidth={3} /> :
                            <Circle className="text-slate-300" strokeWidth={3} />
                        }
                        <span ref={(el) => {
                          if (el) {
                            refs.current[(item.id + Math.ceil(Math.random() + 500)).toString()] = el;
                          }
                        }} className={`absolute w-full text-nowrap capitalize ${item.completed ? "text-green-600 -left-28" : "text-red-600  -left-40"} font-semibold opacity-0`}>
                          {item.completed ? "completed" : "not completed yet"}
                        </span>
                      </button>
                      <button onClick={() => handelDelete(item.id)}>
                        <Trash2 color="red" size={20} />
                      </button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default App