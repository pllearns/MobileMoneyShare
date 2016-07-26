# Fund Koala

![](https://s-media-cache-ak0.pinimg.com/736x/15/8c/a2/158ca2f7e9e1c0e47aef09fe1c8f4039.jpg)

## User Stories:
 - Tom is a well compensated person who wants to share his income with community members, so his friends can join his fund through the app
 - Tom wants a way to verify the needs of the people who take money out of the fund
 - The circle of people engaged in the fund need to put money into the fund and are able to check when they are able to take a payout from the fund, so that no one


 - Sally and her friends want to save money together in a shared fund
 - Sally signs up to the site and starts a 'fund' and invites her friends to join the fund
 - 3 of her friends join the fund and put in a specific percentage of income
 - They each use the income calculator to determine their monthly contribution amount
 - Each month $1000 is collectively put into the fund and is sent to Sally
 - Sally becomes the treasurer of the fund and is responsible for auditing the payments on the ledger

## Features:

 - you can't add or remove someone once a fund has started its cycle
 - Members can join a fund which is the money pot
 - Funds have 1 funding cycle, a funding cycle has n payment cycles based on the amount of people in the circle
 - When you create the fund you specify
  - The cycle amount which is how much you put in
  - Specify the length of the payment cycle (i.e. one month, one week, etc.)

## Terms:

 - Fund is a group of people who pool their money together based on specified criteria at the inception of the fund
 - Funding cycle is the entire process of paying and being paid back for the entire group of peole
 - Payment cycle is an nth (n is the amount of people in the fund) of the funding cycle, each payment cycle members either pay into the fund


## Example Fund

members: Susan, Larry, Tyra, Sam
funding cycle start date:  (1 week from now)
payment cycle length: 1 week
payment cycle amount: $200

so there are 4 payment cycles and the funding cycle is 1 month.

week 1
Susan does nothing
Larry saves $200
Tyra saves $200
Sam saves $200

week 2
Susan is paid $600 from each member directly via venmo
Larry pays $200 to Susan
Tyra pays $200 to Susan
Sam pays $200 to Susan

week 3
Susan pays $200 to Larry
Larry is paid $600 from each member directly via venmo
Tyra pays $200 to Larry
Sam pays $200 to Larry

week 4
Susan pays $200
Larry pays $200
Tyra is paid $600
Sam pays $200

week 4
Susan pays $200
Larry pays $200
Tyra pays $200
Sam is paid $600

## Specifications

- [ ] Mobile responsive
- [ ] Manipulate Bootstrap to achieve modern looking UI
- [ ] Needs to be able to use dynamic data
- [ ] Money sharing calculator
- [ ] Must be able to do user authentication – Log In/Log Out/Sign Up
- [ ] User must be able to update profile
- [ ] Network info must be able to update based on user info (specifically should be able to show how many users are in the network)
- [ ] Must use an algorithm to figure out how much each persyn in the network must share



## Description

An app that allows communities to share monetary resources based on how much income they have and need. This idea is based off a SuSu or Tanda method of loan circles popular in some Black and Brown communities (here and abroad).

## Context
YOU WILL LEARN SO MUCH DOING THIS PROJECT!
One, lots of folks do this already --- wouldn't it be awesome to help communities trade resources more efficiently????

You will learn:
- How to design a relational database
- How to build your own API and connect it to a really modern/superfriendly/awesome UI
- How to do oAUTH
- How to write a basic algorithm (for the money sharing calculator)
- How to Create Read Update Delete in your OWNNN API!!!


APP will be able to:
1. SIGN IN / AUTHENTICATION
2. JOIN A NETWORK
3. FIGURE OUT HOW MUCH YOU CAN SHARE
4. MOBILE FIRST

DATABASE:
1. USER INFO / INCOME SHARING INFO
2. NETWORK INFO & RELATIONSHIPS BETWEEN USERS

CRUD:
1. USER WILL BE ABLE TO CREATE, READ, UPDATE, DELETE - user info and income sharing information, network information.

## Required

Do not remove these specs - they are required for all goals.

- [ ] The artifact produced is properly licensed, preferably with the MIT license.



## Development


### Setup

Create the database:

`createdb fundkoala`

