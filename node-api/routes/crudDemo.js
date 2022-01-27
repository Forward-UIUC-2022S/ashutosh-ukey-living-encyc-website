const express = require("express");
const router = express.Router();
const Joi = require("joi");

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send("Hello World!!!");
});

router.get("/auth", (req, res) => {
  res.send("<a href='/auth/google'>Authenticate with Google");
});

router.get("/protected", (req, res) => {
  res.send("Hello");
});

router.get("/api/courses", (req, res) => {
  res.send(courses);
});

router.get("/api/courses/:id", (req, res) => {
  // res.send(req.params);
  // res.send(req.query);

  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found");
  res.send(course);
});

router.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

router.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found");

  const { error } = validateCourse(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  course.name = req.body.name;
  res.send(course);
});

router.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given id was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

module.exports = router;
