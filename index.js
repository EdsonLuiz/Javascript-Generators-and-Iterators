#! /usr/bin/env node
import { createInterface } from "readline";
import axios from "axios";

const URL = "http://localhost:3333";

const read = createInterface(process.stdin, process.stdout, null);
read.setPrompt("enter command > ");

read.prompt();
read.on("line", (line) => {
  switch (line.trim()) {
    case "list vegan foods":
      {
        axios.get(`${URL}/food`).then(({ data }) => {
          let idx = 0;
          const veganOnly = data.filter((food) => {
            return food.dietary_preferences.includes("vegan");
          });
          const veganIterable = {
            [Symbol.iterator]() {
              return {
                [Symbol.iterator]() {
                  return this;
                },
                next() {
                  const current = veganOnly[idx];
                  idx++;
                  if (current) {
                    return { value: current, done: false };
                  } else {
                    return { value: current, done: true };
                  }
                },
              };
            },
          };
          for (let val of veganIterable) {
            console.log(val.name);
          }
          read.prompt();
        });
      }
      break;
    case "log": {
      read.question("What would you like to log today?", async (item) => {
        const { data } = await axios.get(`${URL}/food`);
        const it = data[Symbol.iterator]();
        let position = it.next();

        while (!position.done) {
          const food = position.value.name;
          if (food === item) {
            console.log(`${item} has ${position.value.calories} calories`);
          }
          position = it.next();
        }

        read.prompt();
      });
    }

    default:
  }
});
