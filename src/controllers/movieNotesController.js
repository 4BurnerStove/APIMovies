const knex = require('../database/knex')

class movieNotesController{
  async create(req, res){
    const { titleMovie, description, grade, moviesTags } = req.body 
    const { user_id } = req.params

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
    const { id } = req.params

    const note = await knex('moviesNotes').where({ id }).first()
    const tags = await knex('moviesTags').where({moviesNotes_id: id}).orderBy('name')
    
    return res.json({
      ...note,
      tags
    })
  }

  async delete(req,res){
    const {id} = req.params

    await knex('moviesNotes').where({ id }).delete()

    return res.json()
  }

  async index(req, res){
    const { user_id, titleMovie, moviesTags } = req.query

    let notes

    if(moviesTags) {
      const filterTags = moviesTags.split(',').map(tag => tag.trim())

      notes = await knex('moviesTags')
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
    notes = await knex('moviesNotes')
    .where({ user_id })
    .whereLike('titleMovie', `%${titleMovie}%`)
    .orderBy('titleMovie')
   }
  res.json(notes)
  }


}

module.exports = movieNotesController