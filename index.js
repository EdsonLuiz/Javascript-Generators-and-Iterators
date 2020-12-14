#! /usr/bin/env node
import { createInterface } from "readline";
import axios from "axios";

const read = createInterface(process.stdin, process.stdout, null);
const URL = "http://localhost:3333";

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

  read.close();
});
