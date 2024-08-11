# Optional Chaining Proposal

Watch the talk [Optional Chaining: From Specification to Implementation](https://youtu.be/bFlzeI8VGnU?si=YffCfFfPwo5uSDoC) by Ross Kirsling (TC39 member) in [JS Japan Conference](https://www.youtube.com/@jsconfjp). December 2022

See the [TC39 Agendas](https://github.com/tc39/agendas) repo. This repo has a folder per year and markdowns 01.md ... for each meeting. 

See the meeting https://github.com/tc39/agendas/blob/main/2017/01.md and see the slides by Gabriel Isenberg (Champion at the time) for the *Null Propagation Operator* at [Google Slides](https://docs.google.com/presentation/d/11O_wIBBbZgE1bMVRJI8kGnmC6dWCBOwutbN9SWOK0fU/view#slide=id.p)


The repository for the Optional Chaining Proposal is at https://github.com/tc39/proposal-optional-chaining
and we  archived in 2022. It is worth to see 
the closed issues. For instance closed issues containing the words [dot after](https://github.com/tc39/proposal-optional-chaining/issues?q=is%3Aissue+is%3Aclosed++dot+after) 


> (6:41) a long time um we had some real uh heated discussions on on GitHub about both
> syntax and semantics um as you're probably aware.
> When we do an optional bracket access we have to write **question dot** square brackets.
> There's still that dot in there. 

> If you were using C sharp you could just write question square brackets and
> people were were kind of like is there no better way do we need that dot? 

He is referring to the question *Why not to use `a?[2]` instead of the verbose `a?.[2]`* 
that was the finally chosen syntax?

> The reason that we need that is to  distinguish it from a ternary, where we might have the ternary question mark followed by the square brackets of an array and that to to determine definitively that we we have an optional bracket access and not  a ternary would require unbounded
> lookahead 

He is referring to the ambiguity of the following expression:

```js 
a ? [2] : [3]
```
 
> ... that's not necessarily a problem for an ahead of time parser but
> it is a problem for JavaScript (parser) and so this this syntactic solution was kind of
> the least bad thing that we could do but as you can see from
> the 282 comments here it was a bit heated um also uh semantics wise in a language