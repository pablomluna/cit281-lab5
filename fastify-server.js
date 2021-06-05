const students = [
    {
      id: 1,
      last: "Last1",
      first: "First1",
    },
    {
      id: 2,
      last: "Last2",
      first: "First2",
    },
    {
      id: 3,
      last: "Last3",
      first: "First3",
    }
  ];

// Require the Fastify framework and instantiate it
const fastify = require("fastify")();
// Handle GET verb for / route using Fastify
// Note use of "chain" dot notation syntax

// Student route 
fastify.get("/cit/student", (request, reply) => {
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(students);
  });

  //Student ID route 
fastify.get("/cit/student/:id", (request, reply) => {
    // Recieve Request
    let studentIDFromClient = request.params.id; 
    // Do something with the information in the request 
    let studentToGiveToClient = null; 

    for (studentFromArray of students) {
        if (studentFromArray.id == studentIDFromClient) {
            studentToGiveToClient = studentFromArray; 
            break; 
        }
    }

    // Provide a response 
    if (studentToGiveToClient != null) {
        reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(studentToGiveToClient);
    }
    else {
        reply
    .code(404)
    .header("Content-Type", "text/html; charset=utf-8")
    .send("Could not find student with given ID");
    }
});

// Undefined/Wildcard route 
fastify.get("*", (request, reply) => {
    reply
      .code(200)
      .header("Content-Type", "text/html; charset=utf-8")
      .send("<h1>At Wildcard route</h1>");
  });

// Add new student by first and last
fastify.post("/cit/students/add", (request, reply) => {
    //Get request from client
    let dataFromClient = JSON.parse(request.body);
    console.log(dataFromClient);
    //Do something with request
      //(1) Figure out max id currently in array
    let maxID = 0; 
    for (individualStudent of students) {
          if (maxID < individualStudent.id) {
              maxID = individualStudent.id; 
          }
      }
      
      // (2) Create a new student ovject of the form: 
            //fname = dataFromClient.firstname
            //...
            //id = maxid + 1
        let generatedStudent = {
                id: maxID + 1,
                last: dataFromClient.lname,
                first: dataFromClient.fname
              };
            // (3) add studnet object created in (2) to 'students'
        students.push(generatedStudent);
            //(4) send the student object created in (2) back to client
    //Reply to client
    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(generatedStudent);
  });


  // Start server and listen to requests using Fastify
const listenIP = "localhost";
const listenPort = 8080;
fastify.listen(listenPort, listenIP, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
