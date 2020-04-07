# Project Jogotal.

This is a demo project for TopTaler interview Round 3.
To access this demo project, go to: http://jogotal.com

* username: 'testuser@jogotal.com'
* password: '42b3f2e2'


## Table of Contents
=================
* [I. Project Description](#i-project-description)
* [II. Backend API](#ii-backend-api)
   * [1. Server:](#1-server)
   * [2. Auth: Token.](#2-auth-token)
* [III. Front-end React](#iii-front-end-react)
* [IV. Deployment](#iv-deployment)
   * [1. Domain: Namecheap](#1-domain-namecheap)
   * [2. Server Hosting: Vultr](#2-server-hosting-vultr)
   * [3. HTTP Server: Nginx](#3-http-server-nginx)
   * [4. Monitoring: Supervisor &amp; Gunicorn](#4-monitoring-supervisor--gunicorn)
      * [a. Supervisor:](#a-supervisor)
      * [b. Gunicorn:](#b-gunicorn)
* [V. Testing](#v-testing)
   * [1. API Unittest:](#1-api-unittest)
   * [2. React Unittest &amp; E2E test:](#2-react-unittest--e2e-test)


## I. Project Description

Write an application that tracks jogging times of users

* User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).
When logged in, a user can see, edit and delete his times he entered.
* Implement at least three roles with different permission levels: a regular user would only be able to CRUD on their owned records, a user manager would be able to CRUD users, and an admin would be able to CRUD all records and users.
* Each time entry when entered has a date, distance, and time.
* When displayed, each time entry has average speed.
* Filter by dates from-to.
* Report on average speed & distance per week.
* REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
* In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
* All actions need to be done client side using AJAX, refreshing the page is not acceptable. (If a mobile app, disregard this).
* Minimal UI/UX design is needed. You will not be marked on graphic design. However, do try to keep it as tidy as possible.
* Bonus: unit and e2e tests.

## II. Backend API

### 1. Server:
API handler is written using Django DRF: http://www.django-rest-framework.org/
To access API end-points and how to use, please go to:

* For users: http://jogotal.com/api/users/
* For jogs: http://jogotal.com/api/jogs/

### 2. Auth: Token.
The implemented token auth is the built-in Django DRF token, which acts similarly to JWT

http://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication

## III. Front-end React

This app uses the boilerplate from Facebook create-react-app.
By adding localhost to CORS of Django. React code can directly do AJAX request to Django backend in development.

* To start app: *npm run start*
* To build app: *npm run build*

For more details on React app, go to README under jogotal_react/README.md

## IV. Deployment

### 1. Domain: Namecheap
Domain is purchased by personal funding from Namecheap.

### 2. Server Hosting: Vultr
A tiny Ubuntu 17.04 x64 instance ($2.50 1 Core & 512MB & 20GB SSD) is rented from Vultr to host this project.

### 3. HTTP Server: Nginx
Virtual server configuration to allow hosting of multiple projects.
For Jogotal, Nginx is configured to pipe localhost port 9000

### 4. Monitoring: Supervisor & Gunicorn

#### a. Supervisor:
Supervisor is great for monitoring multiple applications and restart them at the necessity of code update.
Everything is deployed under virutalenv, which is required to be activated.

* To monitor status of projects: supervisorctl status
* To restart jogotal project: supervisorctl restart jogotal

#### b. Gunicorn:
Gunicorn is used for creating multiple server instances. In this demo project, only 2, as server only has 1 core.
Gunicorn also serves a better user experiencing by using a queue.

## V. Testing

### 1. API Unittest:
Run Django unittest using: python managed.py test

This test will create a separate test library. Therefore, no need to worry about messing up the production database.

### 2. React Unittest & E2E test:
Run React tests using: npm run test

This will run every .test.js files.
