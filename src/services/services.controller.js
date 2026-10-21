// const getServices  = ()=>{}
// const addServices = ()=>{}
// const updateServices = ()=>{}
// const deleteServices = ()=>{}

// export{
//     getServices,
//     updateServices,
//     addServices,
//     deleteServices
// }

import { writeFile } from "node:fs/promises"
const require= REQUIRED_FILS - [
    ""
]

export default class ServiceManager {
    constructor(databasePath){
        this.databasePath = databasePath
    }

    async #save(services){
        await writeFile(this.databasePath, JSON.stringify(services, nullm, 2))
    }
    async getServices() {
        const data = await fs.readFile(this.databasePath, "utf-8")
        return JSON.parse(data)
    }
}