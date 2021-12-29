#README

Brief Description:

Collab Drums is a music web app where users can create rooms and make drum patterns with others in real-time. Users can upload audio samples to cloud storage, click in when they want audio samples to play, and broadcast these changes to all users within that public or private room. 

Why I built it:

Due to COVID, many musicians weren't able to collaborate physically. I wanted to create a solution that alowed them to do so virtually.  


About the tech stack:

Collab Drums is built using MongoDB, Firebase Cloud Storage, Sockets.io, and EJS.  

MongoDB to store user credentials and room data.
Express.js to create API server. 
Firebase Cloud Storage to store audio samples.
Sockets.io for client-to-server communication to relay changes made by user to others in the same room. 
EJS for my templating engine. 


Features:

1) User Authentication
2) Create public and private rooms
3) Broadcast when a user uploads a new audio sample or modifies the drum pattern
4) Ability to adjust BPM

Future Features:

5) Export as wav file
6) Export as MIDI
7) Pitch audio samples 

Demo:
1) User Sign In / Account Creation
2) Create Public or Private Room
3) Send room link
4) Upload Audio Samples
5) Click in drum patterns


Issues that Arose:



Insights:

