# Tweeter Application

Tweeter is a full-stack social media application—akin to a lightweight Twitter—that leverages **React**, **TypeScript**, **Node.js**, and **AWS** services to deliver a scalable, maintainable, and testable system. It demonstrates key software design principles and patterns, ensuring both functionality and extensibility.

## Technologies & Architecture

- **Front End**:  
  - **React** (with Hooks), **TypeScript**, and **Model-View-Presenter (MVP)** pattern to organize UI logic.  
  - Emphasis on clean, reusable components, React hooks, and template methods to reduce code duplication and enhance testability.

- **Back End**:  
  - **Node.js** with **TypeScript** running on **AWS Lambda** functions.  
  - Exposed via **AWS API Gateway** with **Simple Queue Service (SQS)** for asynchronous processing.  
  - **AWS S3** for storing profile images.  
  - **AWS DynamoDB** as the default database, though the system’s **Factory Method/Class** pattern for DAOs makes swapping databases straightforward if desired.

## Design Patterns & Principles

- **Model-View-Presenter (MVP)** on the front end for separating concerns and improving testability.  
- **Factory Pattern (Abstract Factory / Factory Methods)** for data access objects (DAOs), allowing the service layer to remain database-agnostic.  
- **Template Method Pattern** and inheritance used to streamline repetitive tasks and reduce duplication.  
- **Interfaces & Inversion of Control (IoC)** ensuring services only rely on DAO interfaces rather than concrete implementations, promoting easy maintenance and extensibility.

## Features

- **User Management**: Registration, sign-in, sign-out, and user profile customization (including image uploads to S3).  
- **Social Features**: Follow/unfollow, view followers/following lists, and post statuses (featuring user mentions and URL detection).  
- **Feeds & Stories**: Real-time, paginated feeds for each user and their followers’ statuses, with efficient feed updates via SQS.  
- **High Scalability**: Designed to handle 10,000+ users (contingent on AWS usage tiers).  
- **Automated Testing**: Comprehensive Jest and React Testing Library coverage for presenters and components, ensuring reliability and easier refactoring.

## Project Structure

- **tweeter-web**: Front-end (React/TypeScript)  
- **tweeter-shared**: Shared models and utilities used across front end and server  
- **tweeter-server**: Back-end (Node/TypeScript) containing AWS Lambda functions, API Gateway configurations, DAO implementations, and service classes  

This architecture and design approach enable Tweeter to be both robust and flexible, making it an ideal foundation for exploring further enhancements, scaling to large user bases, or integrating additional cloud services.
