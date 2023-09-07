const knex = require('../database/knex')

class movieNotesController{
  async create(req, res){
    const { titleMovie, description, grade, moviesTags } = req.body 
    const user_id = req.user.id

    const [moviesNotes_id]  = await knex("moviesNotes").insert({
      titleMovie,
      description,
      grade,
      user_id
    })

    const tagsInsert = moviesTags.map(name => {
      return {
        moviesNotes_id,
        name,
        user_id
      }
    })

    await knex('moviesTags').insert(tagsInsert)

    res.json()
  }

  async show(req,res){
    const id = req.user.id

    const note = await knex('moviesNotes').where({ id }).first()
    const tags = await knex('moviesTags').where({moviesNotes_id: id}).orderBy('name')
    
    return res.json({
      ...note,
      tags
    })
  }

  async delete(req,res){
    const id = req.user.id

    await knex('moviesNotes').where({ id }).delete()

    return res.json()
  }

  async index(req, res){
    const { titleMovie, moviesTags } = req.query
    const user_id = req.user.id

    let note

    if(moviesTags) {
      const filterTags = moviesTags.split(',').map(tag => tag.trim())

      note = await knex('moviesTags')
      .select([
        "moviesNotes.id",
        "moviesNotes.titleMovie",
        "moviesNotes.user_id"
      ])
      .where("moviesNotes.user_id", user_id)
      .whereLike('moviesNotes.titleMovie', `%${titleMovie}%` )
      .whereIn("name", filterTags)
      .innerJoin("moviesNotes", "moviesNotes.id", "moviesTags.moviesNotes_id")
      .orderBy('moviesNotes.titleMovie')


    } else {
    note = await knex('moviesNotes')
    .where({ user_id })
    .whereLike('titleMovie', `%${titleMovie}%`)
    .orderBy('titleMovie')
   }

   if(!titleMovie || !moviesTags){
     note = await knex('moviesNotes')
     .where({ user_id })
     .orderBy('titleMovie')
   }

    const userTags = await knex('moviesTags').where({user_id})
    const notesWithTags = note.map(note => {
     const noteTags = userTags.filter(tag => tag.moviesNotes_id === note.id)

     return {
       ...note,
       tags: noteTags
     }
   })

  res.json(notesWithTags)
  }

}

module.exports = movieNotesController