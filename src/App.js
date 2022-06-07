import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Books from './components/Books';
import Authors from './components/Authors';
import Publishers from './components/Publishers';
import Navigation from './components/Navigation';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

const App = () => {
 return (
    <BrowserRouter>

    {/* Import Navbar from Navigation component and display it on every page */}
    <Navigation/>
     <div className='App'>

    {/* Switch allows the pages to be changed, The homepage is books which is the first page loaded */}
      <Switch>
        <Route exact path='/' component={Books}/>
        <Route path='/authors' component={Authors}/>
        <Route path='/publishers' component={Publishers}/>
      </Switch>
     </div>
     </BrowserRouter>
  );
 };
export default App;