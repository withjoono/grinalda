import React, { Component, createContext, useState } from 'react';
// stuff in context:
// logged in?
// username
const loginContext = createContext();
const Opt = createContext();

export default loginContext;
export {Opt};