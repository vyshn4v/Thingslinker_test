export default ()=>{
    DATABASE_URL:process.env.DATABASE_URL||"mongodb://localhost:27017/nestjs";
}