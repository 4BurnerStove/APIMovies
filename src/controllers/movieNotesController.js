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
}

module.exports = movieNotesController