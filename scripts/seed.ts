const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();
async function main () {
    try {
        await database.category.createMany({
            data: [
                { name: 'Computer Science'},
                { name: 'Music'},
                { name: 'Fitness'},
                { name: 'Hacking'},
                { name: 'Engineering'},
                { name: 'Filming'}
            ]
        });
        console.log("Sucess")
        
    } catch (error) {
        console.log("Error seding db category", error)
        
    } finally {
        await database.$disconnect()
    }
}
main()