WATTx Software Engineer Challenge: Top Coins -- Jad Jabbour

The challeneg asks that data be pulled from specific APIs and merged. To start off, i decided on javascript/Nodejs.
I built the solution on top of a boilerplate (https://github.com/danielfsousa/express-rest-es2017-boilerplate) it uses
Yarn and has docker compose files ready.

I've created a service module that handles the calls to the APIs and the update of the coins.
To merge the data from both APIs i have decided to use MongoDB and simply updated the coin in question. (shared DB)

I launched these services on a cron job (using cron-job) -- ideally, these would be different services updating the same db

An alternative solution would be to use CouchDB or even add Redis for live data feeds to include in Apps that might be developed
using our API. 

What i didn't have time to do (due to my current work/affairs) is implement proper unit testing, I don't really see a need for it when dealing with just 2 APIs (given the problem here), but assuming that this tool is to be an aggregator of coin info, and more 
sources are to be added, then unit testing would become more integral. 

just run 'yarn dev'

call "localhost:300/v1/get_coins(?limit=n)"