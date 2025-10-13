import prisma from "../utils/prisma"

export default async function getUser() {
    const tasks = await prisma.task.findMany()
    console.log(tasks)

    return tasks
}
