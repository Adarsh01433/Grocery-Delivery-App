import "dotenv/config.js";
import mongoose from "mongoose";
import {Product, Category} from "./src/models/index.js"
import {categories, products} from "./seedData.js";


async function seedDataBase() {
    try {
         await mongoose.connect(process.env.MONGO_URI);
         await Product.deleteMany({});
         await Category.deleteMany({});

         const categoryDocs = await Category.insertMany(categories);

              const categoryMap = categoryDocs.reduce((map, category)=> {
                map[category.name] = category._id;
                return map
              }, {})
                 
              const productWithCategoryIds = products.map((products)=> ({
                ...products,
                category : categoryMap[products.category]
              }));

              await Product.insertMany(productWithCategoryIds);

         console.log("DATABASE SEEDED SUCESSFULLY");
         
    } catch (error) {
         console.error('Error Seeding DateBase:', error)
    } finally {
        mongoose.connection.close()
    }

    
}

seedDataBase();