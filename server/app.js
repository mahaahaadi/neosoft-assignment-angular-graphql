const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const fs = require('fs');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');

const app = express()
  .use(cors())
  .use(json());

const schema = buildSchema(fs.readFileSync('schema.graphql', 'utf8'));
// const characters = parse(fs.readFileSync('characters.csv', 'utf8'), { columns: true });
// const species = parse(fs.readFileSync('species.csv', 'utf8'), { columns: true });

let characters = parse(fs.readFileSync('characters.csv', 'utf8'), { columns: true });
const species = parse(fs.readFileSync('species.csv', 'utf8'), { columns: true });

function getCharacters() {
  return parse(fs.readFileSync('characters.csv', 'utf8'), { columns: true });
}

// const root = {
//   characters: (args) => {
//     return {
//       count: characters.length,
//       characters: characters.slice(args.offset, args.offset + args.limit)
//     };
//   },
//   character: (args) => {
//     return characters.find((ch) => ch.name === args.name);
//   },
//   species: (args) => {
//     return species.find((ch) => ch.name === args.name);
//   },

//   deleteCharacter: (args) => {
//     // Filter out the character to "delete" it
//     const initialLength = characters.length;
//     characters = characters.filter((ch) => ch.name !== args.name);

//     // Check if deletion was successful
//     if (characters.length < initialLength) {
//       return `Character ${args.name} deleted successfully.`;
//     } else {
//       return `Character ${args.name} not found.`;
//     }
//   },
  
// };

const root = {
  characters: (args) => {
    return {
      count: characters.length,
      characters: characters.slice(args.offset, args.offset + args.limit),
    };
  },
  character: (args) => {
    return characters.find((ch) => ch.name === args.name);
  },
  species: (args) => {
    return species.find((sp) => sp.name === args.name);
  },
  // deleteCharacter: (args) => {
  //   const initialLength = characters.length;
  //   characters = characters.filter((ch) => ch.name !== args.name);

  //   if (characters.length < initialLength) {
  //     return `Character ${args.name} deleted successfully.`;
  //   } else {
  //     return `Character ${args.name} not found.`;
  //   }
  // },

  deleteCharacter: (args) => {
    // Filter the characters list in-memory
    const updatedCharacters = characters.filter((ch) => ch.name !== args.name);

    // If a character was removed, update the CSV file to make the deletion permanent
    if (updatedCharacters.length < characters.length) {
      // Update in-memory array and CSV file
      characters = updatedCharacters;
      fs.writeFileSync('characters.csv', stringify(updatedCharacters, { header: true }));
      return `Character ${args.name} deleted successfully.`;
    } else {
      return `Character ${args.name} not found.`;
    }
  },
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4201, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log('Server listening on port 4201');
});