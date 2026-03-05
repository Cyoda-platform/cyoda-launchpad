---
title: "LLM’s Can Get You to a Demo Fast. In Fintech, After That It Gets Hard."
author: "Patrick Stanton"
date: "2026-03-05"
category: "Informative"
excerpt: "Vibe Coding can get you to a working MVP in a few weeks. But in fintech , the real test begins after the demo. This article explores why fast AI-generated builds often hit a wall when faced with real-world iteration, compliance, and due diligence and what semi-technical and non-technical founders need to put in place early to avoid painful rewrites later."
featured: false
published: true
image: "/images/blogs/vibing-to-the-wall.png"
tags: ["informative", "nonTechnical"]
---

# LLM’s Can Get You to a Demo Fast. In Fintech, After That It Gets Hard.

Andrej Karpathy coined the term "vibe coding" in February 2025: "you fully give in to the vibes, embrace exponentials, and forget that the code even exists." He meant it affectionately.  
Getting to a working demo in fintech has never been easier. With today’s LLM based tooling, a semi-technical founder can build something that really conveys the business value of their proposition in weeks. Two years ago that same work needed a small team for months. The technical barrier to proving product-market-fit has never been lower.

The problem is that the same tools that collapsed the cost of building a demo have convinced a lot of founders they're further along than they are. The demo opens a conversation, and in fintech, that conversation turns technical faster than other industries.

## The challenge is getting beyond the vibe-coded Demo

## The founders who built these systems did something hard: **They validated a market**. They got meetings that most startups never get.

I've watched this pattern play out with several startups now. The demo works well enough, the founder shows it to prospects. The prospects like it and ask for a few changes and this is where things start to unravel, because every change introduces a new break. Fixes create side effects, refactoring feels dangerous because the generated safety net (tests) is also a black box. The codebase gets progressively harder to iterate.

Kent Beck put it well: "If you're generating code at 10x speed with no tests, you're generating legacy code at 10x speed."

I don't fully understand how people can claim autonomous agentic coding can do anything beyond scaffolding prototypes without structure, rails and supervision, not yet, anyway. Generative AI tools can cut initial coding time significantly, the time spent on code review, testing, and debugging hasn't decreased proportionally. That gap is the story. I've seen a founder build three new features in a week with AI assistance, then spend the next two weeks manually tracking down regressions issues because there was nothing automated catching the breakage. 

## What AI actually does to your codebase

We built Cyoda specifically for this problem, so I have a view here. But the pattern remains: when startups vibe code past the demo stage, the AI incorporates features that were never asked for, it interprets field names freely based on what it thinks they might mean, without checking comments or docs. 

It introduces security holes, hardcoded API keys in config files, skipped auth checks on internal endpoints, overly permissive CORS rules, comments out code or settings that were there for a reason, because they got in the way of the immediate fix. When something breaks, it patches things piecemeal instead of recognizing a problem pattern and solving it everywhere. It doesn't recognize opportunities to create clean architectural patterns, it just patches things ad-hoc.

There’s no guarantee that AI tooling will respect the rails you specify in your rules governing its work. And the more you specify, the more likely it will miss important things. The more rules you give, the more holes it will punch, because it doesn’t see the forest for the trees.

Without structure you easily end up in "repair-prompting hell" on a project where every prompt to fix one issue breaks another and it’s not converging on a fix, they are making the codebase less coherent with each iteration. Like trying to comb matted hair, each prompt makes it a little worse.

## In fintech, the debt is due earlier than you think

In other markets, you might be able to outrun technical debt for a while. In fintech, you can't, because your prospective customer's compliance team shows up at, or before, the PoC stage.

Banks often bring a software engineer to the early meetings specifically to tick compliance boxes  even before a PoC, with questions like: can you prove exactly what happened, when? Can you control who accesses what? Can you show us a repeatable deployment process? How will you match our service level objectives, like uptime/availability?

If you can't answer those questions, the deal dies regardless of how good the demo looked. In fintech, you have a multitude of product reviewers, like compliance teams, ops, security, etc. You need more than business-side buy-in.

## To keep building fast you need a delivery chain.

This is the part that non-technical founders often push back on, because it sounds like overhead. 

* clean, modular system and software architecture that is designed for change from the ground up and keeps you agile.  
* The software itself must be designed to deal with failures and edge cases, and it must tick all the non-functional compliance boxes.  
* solid test harness, unit tests, integration tests, end-to-end tests, all validated with a business and technical lens, that protects you from regression going undetected.  
* a robust, highly automated and secure CI/CD pipeline

It’s the combination of these elements that keep you moving fast. Without, every change risks becoming an arduous exercise. You need to explicitly work towards these goals – with the help of LLMs, of course – but they won’t do that for you “out of the box”.

## ---

I've seen founders become afraid to deploy on any day close to a customer meeting. In the end, the team was batching changes into fortnightly releases and manually smoke-testing; the definition of a snail’s pace.

I’ve watched a team lose three weeks because their AI-built MVP had business logic, API handling, and database queries tangled together in the same files. A change to how one calculation worked broke an unrelated API endpoint, which broke a downstream report. The AI had no concept of boundaries, so neither did the codebase.

If you don't build rails for LLMs early, to delimit the scope of feature builds, and ensure the correct foundations from the start, the output keeps coming, but the structure underneath gets less coherent with every change. 

That's how "fast MVP" turns into "slow product delivery".

## ---

The founders I've seen navigate this well did one thing differently: they established engineering competence before the PoCs started, before the banks began asking the technical questions.

Your demo gets you into the conversation. It starts the sales cycle and gets you taken seriously. But what closes the deal is your ability to deliver the system they actually want, and to pass the due diligence that comes with it. Those are two different things, and a lot of founders don't find that out until they're in the room.

## A quick checklist before your fintech PoC

If you're building in fintech right now, which of these caught up with you first?

* Can you deploy to staging repeatably? If not, every PoC environment is a one-off, and no two demos are testing the same thing.  
* Do automated tests run on every change? If not, you can't safely touch anything without manually verifying that nothing broke.  
* Do you have authentication and authorization built in that controls access, and an audit trail of all changes? If not, the compliance question will most likely end your prospect.  
* If you need to make changes, especially significant ones, does your architecture cater to that, do you have tests protecting existing behaviour? If not, a day's refactor will take weeks and introduce new bugs that might not be detected until it’s too late.