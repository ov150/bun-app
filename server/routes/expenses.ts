import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";


const expenseSchema = z.object({
    id:z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(), 
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({id:true})


const fakeExpense: Expense[] = [
    {
        id:1,
        title: "underscore with id 1",
        amount: 1000
    },
    {
        id:2,
        title: "underscore with id 2",
        amount: 2000
    },
    {
        id:3,
        title: "underscore with id 3",
        amount: 3000
    },
    {
        id:4,
        title: "underscore with id 4",
        amount: 4000
    }
]

const expenseRoute = new Hono();
expenseRoute.get("/", c=>{
    return c.json({
        expenses: fakeExpense
    })
})

expenseRoute.post("/", zValidator("json", createPostSchema), async c=>{
    const data  = await c.req.valid("json");
    fakeExpense.push({...data, id: fakeExpense.length+ 1})
    return c.json(data)
})

expenseRoute.get("/total-spent",async c=>{
    await new Promise((r)=> setTimeout(r,1000))
    const totalExpenses = fakeExpense.reduce((acc, expense)=> acc + expense.amount, 0);
    return c.json({totalExpenses});
})


expenseRoute.get("/:id{[0-9]+}", c=>{
    const id = Number.parseInt(c.req.param('id'));
    const expense = fakeExpense.find(expense => expense.id === id);
    if(!expense){
        return c.notFound();
    }
    return c.json({expense})
})



expenseRoute.delete("/:id{[0-9]+}", c=>{
    const id = Number.parseInt(c.req.param('id'));
    const expense = fakeExpense.findIndex(expense => expense.id === id);
    if(expense === -1){
        return c.notFound();
    }

    const deleteExpense = fakeExpense.splice(expense, 1)[0];
    return c.json({expense: deleteExpense})
})



export {
    expenseRoute
};