const express=require ("express")
const router= express.Router()
const Book= require("../models/book.models.js");






//middleware para obtener id, manejar la sol http, sacanddola del req.params
const getBook= async (req,res,next)=>{
//inicio obj sin definir
let book;

//id
const {id}= req.params;
//validamos si es un 24 
if(!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).json({
        message:"el id no es valido"
    })
}

try {
    
    book= await Book.findById();
    if(!book){
    return res.status(404).json({
        message:"el libro no fue encontrado"
    })
    }

} catch (error) {
    res.status(500).json({message:error.message})
}

res.book=book;
next()

}





//definimos las rutas get, que es lo q haran 
router.get("/", async(req,res)=>{

try {
    const books= await Book.find()
    console.log(books)
    if(books.length === 0){
        return res.status(204).json([])
    }
    res.json(books)
} catch (error) {
    res.status(500).json({message:error.message})
}

})

//definimos la ruta post, la creacion de recursos

router.post("/", async(req,res)=>{

    //body de la request y sus campos
    const{title, author, genre,publication_date}=req?.body
    if(!title||!author|| !genre|| !publication_date){
        return res.status(400).json({message:"Completa todos los campos por favor"})
    }

//creacion del objeto nuevo book
    const book= new Book (
        {title, 
        author, 
        genre,
        publication_date}
    )

    console.log(book)
    try {
        
        const newbook= await book.save()
        console.log(newbook)
        res.status(201).json(newbook)

    } catch (error) {
        res.status(400).json({message:error.message})
    }


})

//ruta get id

router.get("/:id", getBook, async(req,res)=>{
    //tenemos ya book en res, en el middleware
    res.json(res.book)
})



//put ruta
router.post("/", async (req, res) => {
    try {
        const { title, author, genre, publication_date } = req.body;

        // Comprobar si todos los campos están presentes
        if (!title || !author || !genre || !publication_date) {
            return res.status(400).json({ message: "Completa todos los campos por favor" });
        }

        const book = new Book({ title, author, genre, publication_date });
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ message: error.message });
    }
});


module.exports= router