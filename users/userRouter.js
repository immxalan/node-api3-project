const express = require('express');
const userDb = require("./userDb");
const postDb = require("../posts/postDb");
const router = express.Router();

router.post('/',validateUser,(req, res) => {
  // do your magic!
  const userInfo = req.body;

	userDb
		.insert(userInfo)
		.then(newUser => {
			res.status(201).json(newUser);
		})
		.catch(error => {
			res.status(500).json({ error: 'New user could not be created.', error });
		});
});

router.post('/:id/posts', validateUserId,validatePost,(req, res) => {
  // do your magic!
  const postInfo = req.body;

	postDb
		.insert(postInfo)
		.then(newPost => {
			res.status(201).json(newPost);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'There was an error creating the post.', err });
		});
});

router.get('/', (req, res) => {
  // do your magic!
  userDb
		.get()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(error => {
			res.status(500).json({ error: 'Could not retrieve users data.', error });
		});
});

router.get('/:id',validateUserId,(req, res) => {
  // do your magic!
  userDb
		.getById(req.params.id)
		.then(user => {
			res.status(200).json(user);
		})
		.catch(error => {
			res.status(500).json({
				error: 'There was an issue with retrieving the user ID.',
				error
			});
		});
});

router.get('/:id/posts', validateUserId,(req, res) => {
  // do your magic!
  const { id } = req.params;

	userDb
		.getUserPosts(id)
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: "There was an error retrieving user's posts.", error });
		});
});

router.delete('/:id', validateUserId,(req, res) => {
  // do your magic!
  const { id } = req.params;
	userDb
		.remove(id)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The user has been deleted' });
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue deleting the user.', error });
		});
});

router.put('/:id', validateUserId,validateUser,(req, res) => {
  // do your magic!
  const userInfo = req.body;
	const { id } = req.params;

	userDb
		.update(id, userInfo)
		.then(count => {
			if (count > 0) {
				res.status(200).json({ message: 'The user has been updated' });
			} else {
				res.status(404).json({ message: 'The user could not be found' });
			}
		})
		.catch(error => {
			res
				.status(500)
				.json({ error: 'There was an issue updating the user.', error });
		});
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
	if (!id) {
		res.status(400).json({ error: 'Must include user ID in URL.' });
	} else {
		userDb
			.getById(id)
			.then(user => {
				if (user === undefined) {
					res.status(400).json({ error: 'User does not exist' });
				} else {
					next();
				}
			})
			.catch(error => {
				res
					.status(500)
					.json({
						error: 'There was an issue with retrieving the user ID.',
						error
					});
			});
	}
}

function validateUser(req, res, next) {
  // do your magic!
  const body = req.body;
	const name = req.body.name;

	if (Object.keys(body).length===0) {
		res.status(400).json({ error: 'Missing user data.' });
	} else if (!name) {
		res.status(400).json({ error: 'Missing required name field.' });
	} else {
		next();
	}
}

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body;
	const text = req.body.text;

	if (Object.keys(body).length===0) {
		res.status(400).json({ error: 'Missing post data.' });
	} else if (!text) {
		res.status(400).json({ error: 'Missing required text field.' });
	} else {
		next();
	}
}

module.exports = router;
