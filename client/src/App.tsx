// import { useEffect, useState } from 'react'
import './App.css'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import  { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api";
async function getTotalSpent(){
  const result = api.expenses["total-spent"].$get()
  if(!result.ok){
    throw new Error("server error")
  }
  const data = await result.json()
  return data
}

function App() {
  // const [totalSpent, setotalSpent] = useState(0);
  const {data , isPending, error} = useQuery({ queryKey : ['get-total-spent'], queryFn: getTotalSpent})
  // if(isPending) return "loading..."
  if(error) return 'An error has occurred' + error.message

  return (
    <>
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>{ isPending ? "..." : data.totalSpent}</CardContent>
      </Card>
    </>
  )
}

export default App
