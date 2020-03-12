const express = require('express');
const postDb = require("./postDb")

const router = express.Router();

router.get('/', (req, res) => {
  postDb.get(req)
  .then( e => {
    res.status(200).json(e)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving data"})
  })
});

router.get('/:id', (req, res) => {
  postDb.getById(req.params.id)
  .then(e => {
    if(e){
      res.status(200).json(e);
    } else {
      res.status(404).json({ message: "ID not found"})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: "Error retrieving ID"})
  })
})

router.delete('/:id', validatePostId,(req, res) => {
 postDb.remove(req.params.id)
 .then(count => {
   if (count > 0 ) {
     res.status(200).json({ message: "The ID has been deleted"})
   } else {
     res.status(404).json({ message: "The ID could not be found"})
   }
 })
 .catch(error => {
   console.log(error);
   res.status(500).json({
     message: "Error deleting the ID"
   })
 })
});

router.put('/:id', validatePostId,(req, res) => {
  // do your magic!
	const postInfo = req.body;
	const { id } = req.params;

	postDb
		.update(id, postInfo)
		.then(e => {
			if (e > 0) {
				res.status(200).json({ message: 'The post has been updated' });
			} else {
				res.status(404).json({ message: 'The post could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue updating the post.', error });
		});
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const id = req.params.id;

	if (!id) {
		res.status(400).json({ error: 'Must include post ID in URL.' });
	} else {
		postDb
			.getById(id)
			.then(post => {
				if (post === undefined) {
					res.status(400).json({ error: 'Post does not exist.' });
				} else {
					next();
				}
			})
			.catch(error => {
				res.status(500).json({
					error: 'There was an issue with retrieving the post ID.',
					error
				});
			});
	}
}

module.exports = router;
