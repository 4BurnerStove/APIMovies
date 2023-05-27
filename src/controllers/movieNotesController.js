const knex = require('../database/knex')

class movieNotesController{
  async create(req, res){
    const { titleMovie, description, grade, moviesTags } = req.body 
    const { user_id } = req.params

    const { movies_notes_id } = await knex("moviesNotes").insert({
      titleMovie,
      description,
      grade,
      user_id
    })

    const tagsInsert = moviesTags.map(name => {
      return {
        movies_notes_id,
        name,
        user_id
      }
    })

    await knex('moviesTags').insert(tagsInsert)

    res.json()
  }
}

module.exports = movieNotesController