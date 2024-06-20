"use client";

import { User, createUser, getUserById } from "@/actions/userActions";
import { currentUser } from "@clerk/nextjs";
import React, { useState } from "react";

const Test = () => {
  const [getUser, setGetUser] = useState("");

  // Example data for a new user
  const newUserDetails = {
    email: "example2@example.com",
    phone: "12345653229",
    location: "Some Location",
    username: "unique_usernamee",
    shopType: "Retail",
  };

  

  // Example usage: Creating a new user
  async function createUserExample() {
    try {
      const newUser = await createUser(newUserDetails);
      console.log("\n\nNew user created:", newUser);
    } catch (error) {
      console.error(error);
    }
  }

  // // Example usage: Retrieving a user by ID
  async function getUserByIdExample() {
    try {
      const userIdToRetrieve = 63; // Replace with the actual user ID
      const user = await getUserById(userIdToRetrieve);
      console.log("Retrieved user:", user);
      setGetUser(user ? user.phone : "hello");
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  // createUserExample()
  // getUserByIdExample();

  return <div>{getUser}</div>;
};

export default Test;
