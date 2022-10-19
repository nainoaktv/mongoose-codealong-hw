const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./schemas/post');
const User = require('./schemas/user');
// const { Comment } = require('./schemas/comment')

const mongoDb = 'mongodb://127.0.0.1/mongoose-codealong';
mongoose.connect(mongoDb, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
  console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to our API'
  })
});

app.get('/users', (req, res) => {
  User.find({})
  .then(users => {
      console.log('All users', users);
      res.json({ users: users });
  })
  .catch(error => { 
      console.log('error', error);
      res.json({ message: "Error ocurred, please try again" });
  });
});

app.get('/users/:email', (req, res) => {
  console.log('find user by', req.params.email)
  User.findOne({
      email: req.params.email
  })
  .then(user => {
      console.log('Here is the user', user.name);
      res.json({ user: user });
  })
  .catch(error => { 
      console.log('error', error);
      res.json({ message: "Error ocurred, please try again" });
  });
});

app.post('/users', (req, res) => {
  User.create({
      name: req.body.name,
      email: req.body.email,
      meta: {
          age: req.body.age,
          website: req.body.website
      }
  })
  .then(user => {
      console.log('New user =>>', user);
      res.json({ user: user });
  })
  .catch(error => { 
      console.log('error', error) 
      res.json({ message: "Error ocurred, please try again" })
  });
});

app.put('/users/:email', (req, res) => {
  console.log('route is being on PUT')
  User.findOne({ email: req.params.email })
  .then(foundUser => {
      console.log('User found', foundUser);
      User.findOneAndUpdate({ email: req.params.email }, 
      { 
          name: req.body.name ? req.body.name : foundUser.name,
          email: req.body.email ? req.body.email : foundUser.email,
          meta: {
              age: req.body.age ? req.body.age : foundUser.age,
              website: req.body.website ? req.body.website : foundUser.website
          }
      })
      .then(user => {
          console.log('User was updated', user);
          res.redirect(`/users/${req.params.email}`)
      })
      .catch(error => {
          console.log('error', error) 
          res.json({ message: "Error ocurred, please try again" })
      })
  })
  .catch(error => {
      console.log('error', error) 
      res.json({ message: "Error ocurred, please try again" })
  })
  
});

app.delete('/users/:email', (req, res) => {
  User.findOneAndRemove({ email: req.params.email })
  .then(response => {
      console.log('This was delete', response);
      res.json({ message: `${req.params.email} was deleted`});
  })
  .catch(error => {
      console.log('error', error) 
      res.json({ message: "Error ocurred, please try again" });
  })
});

// POST ROUTES
app.get('/posts', (req, res) => {
  Post.find({})
      .then(posts => {
          console.log('All posts', posts);
          res.json({ posts: posts });
      })
      .catch(error => {
          console.log('error', error);
          res.json({ message: "Error ocurred, please try again" });
      });
});

app.get('/posts/:title', (req, res) => {
  console.log('find user by', req.params.title)
  Post.findOne({
      title: req.params.title
  })
      .then(post => {
          console.log('Here is the user', post);
          res.json({ post: post });
      })
      .catch(error => {
          console.log('error', error);
          res.json({ message: "Error ocurred, please try again" });
      });
});

app.post('/posts', (req, res) => {
  Post.create({
      title: req.body.title,
      body: req.body.body,
  })
      .then(post => {
          console.log('New post =>>', post);
          res.json({ post: post });
      })
      .catch(error => {
          console.log('error', error)
          res.json({ message: "Error" })
      });
});

app.put('/posts/:title', (req, res) => {
  console.log('route is being on PUT')
  User.findOne({ title: req.params.title })
      .then(foundPost => {
          Post.findOneAndUpdate({ title: req.params.title },
              {
                  title: req.body.title ? req.body.title : foundPost.title,
                  body: req.body.body ? req.body.body : foundPost.body,
              })
              .then(post => {
                  res.redirect(`/users/${req.params.title}`)
              })
              .catch(error => {
                  console.log('error', error)
                  res.json({ message: "Error" })
              })
      })
      .catch(error => {
          console.log('error', error)
          res.json({ message: "Error" })
      })

});

app.delete('/posts/:title', (req, res) => {
  User.findOneAndRemove({ email: req.params.title })
      .then(response => {
          console.log('This was delete', response);
          res.json({ message: `${req.params.title} deleted` });
      })
      .catch(error => {
          console.log('error', error)
          res.json({ message: "Error" });
      })
});

// COMMENT ROUTES
app.get('/comments', (req, res) => {
  Comment.find({})
      .then(comments => {
          res.json({ comments: comments });
      })
      .catch(error => {
          console.log('error', error);
          res.json({ message: "Error ocurred, please try again" });
      });
});

app.get('/comments/:header', (req, res) => {
  console.log('find user by', req.params.header)
  Comment.findOne({
      header: req.params.header
  })
      .then(comment => {
          res.json({ post: post });
      })
      .catch(error => {
          console.log('error', error);
          res.json({ message: "Error" });
      });
});

app.post('/comments', (req, res) => {
  Comment.create({
      header: req.body.header,
      content: req.body.content,
      date: req.body.date
  })
      .then(comment => {
          res.json({ comment: comment });
      })
      .catch(error => {
          console.log('error', error)
          res.json({ message: "Error" })
      });
});

app.put('/comments/:header', (req, res) => {
  Comment.findOne({ header: req.params.header })
      .then(foundComment => {
          Comment.findOneAndUpdate({ header: req.params.header },
              {
                  header: req.body.header ? req.body.header : foundComment.header,
                  body: req.body.body ? req.body.body : foundComment.body,
                  date: req.body.date ? req.body.date : foundComment.date
              })
              .then(comment => {
                  console.log(comment);
                  res.redirect(`/users/${req.params.header}`)
              })
              .catch(error => {
                  console.log('error', error)
                  res.json({ message: "Error" })
              })
      })
      .catch(error => {
          console.log('error', error)
          res.json({ message: "Error" })
      })

});

app.delete('/comments/:header', (req, res) => {
  Comment.findOneAndRemove({ email: req.params.header })
      .then(response => {
          res.json({ message: `${req.params.header} deleted` });
      })
      .catch(error => {
          console.log('error', error)
          res.json({ message: "Error" });
      })
});

// app.get('/findAll', (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) res.send(`Failed to find record, mongodb error ${err}`);
//     res.send(users);
//   })
// })

// app.get('/findById/:id', (req, res) => {
//   User.findById(req.params.id, (err, users) => {
//     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//     res.send(users);
//   })

  //find by Id without the findByID command, not ideal
  // User.find({_id: mongoose.Types.ObjectId(Objreq.params.id)}, (err, users) => {
  //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
  //     res.send(users);
  // })
// })

// app.get('/findByEmail/:email', (req, res) => {
//   User.findOne({ email: req.params.email }, (err, users) => {
//     if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//     res.send(users);
//   })
// })


// creating users directly form model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using new User and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })

// Creating a simple post document in the post collection
// Post.create({
//     content: 'This is pst content...'
// });

// User.updateOne({name: 'Robert'}, {
//   meta: {
//     age: 56
//   }
// }, (err, updateOutcome) => {
//   if (err) return console.log(err);
//   console.log(`updated user: ${updateOutcome.matchCount} : ${updateOutcome.modifiedCount}`);
// })

// Returns full object prior to update
// User.findOneAndUpdate({name: 'Robert'}, {
//   meta: {
//     website: 'SomethingDifferent.com'
//   }
// }, (err, user) => {
//   if (err) return console.log(err);
//   console.log(user);
// });

// Mongoose DELETE statements
// User.remove({name: 'Robert'}, (err) => {
//   if (err) return console.log(err);
//   console.log('user record deleted');
// })

// User.findOneAndRemove({name: 'Chris'}, (err) => {
//   if (err) return console.log(err);
//   console.log('user record deleted');
// })

// Post schema with association to comments
// const newPost = new Post({
//   title: 'our first post',
//   body: 'Some body text for our post'
// })

// newPost.comments.push({
//   header: 'our first comment',
//   content: 'this is my comment text'
// })

// newPost.save(function(err) {
//   if (err) return console.log(err);
// console.log(`Created post ${this.title}`);
// })

// const refPost = new Post({
//   title: 'Post with ref to commenst',
//   body: 'Body for ref by comments'
// });

// const refComment = new CommentModel({
//   header: 'Our ref comment',
//   content: 'Some comment content'
// });
// refComment.save();

// refPost.comments.push(refComment);
// refPost.save

// NOT WORKING
// Post.findOne({title: 'testing'}, (err, post) => {
//   Post.findById(post._id).populate('comments').exec((err, post) => {
//     console.log(post);
//   })
// })

app.listen(8000, () => {
  console.log('Running port 8000')
});