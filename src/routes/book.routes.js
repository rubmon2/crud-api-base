const express=require ("express")
const router= express.Router()
const Book= require("../models/book.models.js");






//middleware para obtener id, manejar la sol http, sacanddola del req.params
const getBook= async (req,res,next)=>{

//inicio var sin definir
let book;

//id desestructuro de params
const {id}= req.params;
//validamos si es un valor de 24,  para q no envien otra cosa
if(!id.match(/^[0-9a-fA-F]{24}$/)){
    return res.status(404).json({
        message: "el id no es valido"
    });
}


//entonces seguimos con el trycatch y metodo findbyid teniendo en cuenta el modelo/schema
try {
    //pasamos el id, previamente a ya tenerlo y luego de validaciones
    book= await Book.findById(id);
    if(!book){
    return res.status(404).json({
        message:"el libro no fue encontrado"
    })
    }

} catch (error) {
    res.status(500).json({message:error.message})
}

//la respuesta va a hacer el book/modelo/schema, id correspondiente 
res.book=book;
//pasamos a la siguiente ejecucion, por eso next. 
//el middleware es un intermedio, una forma de manejar algun dato de la solicitud http
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
    //si no esta alguno de estos campos que devuelva un error
    if(!title||!author|| !genre|| !publication_date){
        return res.status(400).json({message:"Completa todos los campos por favor"})
    }

//creacion del objeto nuevo book, no hace falta igual las key y value(title:title, author:author, etc)
    const book= new Book (
        {title, 
        author, 
        genre,
        publication_date}
    )

    console.log(book)
    try {
        //guardamos el nuevo libro en el metodo save y devolvemos un status json con el libro
        const newbook= await book.save()
        console.log(newbook)
        res.status(201).json(newbook)

    } catch (error) {
        res.status(400).json({message:error.message})
    }


})

//ruta get id de req.params, el middleware, y la async de req,res.
router.get("/:id", getBook, async(req,res)=>{
    //tenemos ya book en res, en el middleware y es la respuesta json que enviamoss
    res.json(res.book)
})



//put ruta
router.put("/:id", getBook,async (req, res) => {
    //al buscar el id en el middleware ya tenemos un objeto,ese objeto
    const book=res.book

   //para enviar la actualizacion tengo q mantener los campos completos 
    if(!req.body.title && !req.body.genre && !req.body.author && !req.body.publication_date){
        res.status(400).json({message:"Los campos tienen que estar completos"})
    }

  try {
     //entonces lo q tratamos aca es son los cambios y si no hay cambiamos q devuelva el valor q tiene
     book.title=req.body.title || book.title;
     book.genre =req.body.genre||book.genre;
     book.author=req.body.author||book.author;
     book.publication_date=req.body.publication_date||book.publication_date

    //guardamos el nuevo libro actualizado
    const updateBook= await book.save()
    res.json(updateBook)

  } catch (error ) {
    res.status(400).json({message:error.message})
  }
});

//ruta delete
router.delete("/:id", getBook, async(req,res)=>{
            
try {
    //al no tener if
    const book=res.book
    //en el parametro _id tenemos el id book
    await book.deleteOne({_id: book.id})
    res.json({message: `el libro ${book.title} fue eliminado`})

} catch (error) {
    res.status(500).json({message:error.message})
}


})


module.exports= router