---
title       : R for the web through pop data analysis 
subtitle    : 
author      : Ben Moore
job         : Section meeting 16/09/2014
framework   : io2012        # {io2012, html5slides, shower, dzslides, ...}
highlighter : highlight.js  # {highlight.js, prettify, highlight}
hitheme     : tomorrow      # 
widgets     : mathjax            # {mathjax, quiz, bootstrap}
mode        : selfcontained   # {selfcontained, standalone, draft}
logo        : logo.png
---

<!-- Limit image width and height -->
<style type='text/css'>

.rChart {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 500px;
    height: 500px !important;
}

img {
    max-height: 540px;
    max-width: 964px;
}
body {
  /* margin-top: 40px; */
}
ol.linenums {
  margin-left: 0px;
}
#features p {
  font-size: 14px;
  line-height: 21px;
  color: #777777;
}
#solo p {
  text-align:center;
  font-size:xx-large;
  /* font-weight:bolder; */
  margin-top:25%;
  color:#777777;
}

.title-slide {
  background-color: #FEFEFE;
}

h1 {
  color: #DDDDDD;
}


#bigwriting {
  font-size:x-large;
}

</style>

<!-- Center image on slide -->
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.min.js"></script>
<script src='http://d3js.org/d3.v3.min.js' type='text/javascript'></script>
<script src='http://dimplejs.org/dist/dimple.v2.1.0.min.js' type='text/javascript'></script>

<script type='text/javascript'>
$(function() {
    $("p:has(img)").addClass('centered');
});
</script>

## I'm going to talk about...

<br />

A couple of examples of R analyses I've done for fun (see old site <a href="http://benjaminlmoore.wordpress.com">benjaminlmoore.wordpress.com</a>, or new <a href="http://blm.io/blog">blm.io/blog</a>). 

<br />

Along the way:

* Hacking R into web frameworks with rCharts and slidify

* Tips for would be "data scientists" / data bloggers

* Getting people to actually read your stuff

--- #solo 

Example 1: Author inflation

--- bg:black

![academia.stackexchange](figure/ac.se.png)

---

## Staring point

<br />

* Good question

<br />

* No real answers, speculation

<br />

> * Easy to test!!


--- 

## Getting some data

<br />

![ropensci](figure/ropensci.png)

<div style="width: 50%; margin-left: auto; margin-right: auto; margin-top: 10%">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/PLOS_logo_2012.svg/500px-PLOS_logo_2012.svg.png" />
</div>


---

## Code


```r
searchplos(
  # Query: publication date in 2012
  q  = 'publication_date:[2012-01-01T00:00:00Z TO 2012-12-31T23:59:59Z]', 
 
  # Fields to return: id (doi) and author list
  fl = "id,author", 
 
  # Filter: only actual articles in journal PLOS ONE
  fq = list("doc_type:full",
            "cross_published_journal_key:PLoSONE"), 
 
  # 500 results (max 1000 per query)
  start=0, limit=500, sleep=6)
```


--- &rightcol

## Results

*** =left

<br />

![author beanplots](figure/plos1.png)

*** =right

<br />

![author ecdf](figure/plos2.png)

--- bg:black

## 270 authors...

![270 authors](figure/270.png)

---

## Evidence for author inflation

![lm](figure/plos3.png)

--- &leftcol

## High impact == high inflation ?

*** =left

![corr with IF](figure/plos4.png)

*** =right

<b>NB</b> NS correlation ◕︵◕

<u>TODO</u>

> * expand to entire NLM Medline / Pubmed records (>22 mill)

> * Try to get at "good inflation vs. bad inflation"

>   * Relative growth of acknowledgements? (PMC)

--- #solo 

Example 2: Overrated movies

---

## Starting point

<br />

* Everyone relates to concept of "over/underrated" — but it's inherently subjective

* Maybe a way to quantify this (with, e.g. films) could be:

<br />

> * <b>Critic ratings</b> — subjective ratings

> * <b>Audience ratings</b> — "objective truth"

>   * (Wrong way round? Up to you... ) <br /><br />

> * So given this definition of "overrated": <br /><p style="font-size: 1.3em; text-align: center;"><b>Q:</b> What are the most (over|under)rated films?</p>


--- 

![rt](figure/rtlogo.png)

They have a REST API! 


```r
library("RCurl")
library("jsonlite")

api.key <- "somelongAPIkey"
rt <- getURI(paste0("http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?apikey=", api.key, "&limit=50"))

rt <- fromJSON(rt)

title <- rt$movies$title
critics <- rt$movies$ratings$critics_score
audience <- rt$movies$ratings$audience_score
```

--- 

<p style="font-color: #ffa775; font-size: 1.4em; text-align: center;">This is easy, why hasn't someone done it before...</p>

<br />

![forum](figure/apiforum.png)

<br />

<div style="text-align: center;"><h2>!!!</h2></div>

--- 

## Hacky solution

<br />

> 1. Get largest starting list of films possible (Top rentals: <b>50</b>)

> 2. For each, retrieve "similar films" (max: <b>5</b>!)

> 3. Rinse, recurse

> 4. Enjoy the expontential growth...

--- &rightcol

## "Walled gardens"

*** =left

<br />

<br />

![hits](figure/hits.png)

*** =right

<br />

![hp](figure/hp.png)

---

## Results v1

![results1](figure/films1.png)

---

## Results v2

<div id='chart12666f920d7f' class='rChart dimple'></div>
<script src="js/films.js"></script>

---

<p style="text-align:center; font-size:xx-large; margin-top:20%">
Thanks for your attention
</p>
<br />
<p style="font-size:smaller; text-align:center">
Supervisors: Colin Semple and Stuart Aitken</div>
</p>


<div style="float:left; margin-top:18%">
<p style="font-size:small">References:</p>
<p style="font-size:x-small">
  Belton et al. (2012) Hi-C: a comprehensive technique to capture the conformation of genomes. <strong>Methods</strong>, 58, 268-76.
<br />
  Boyle et al. (2014) Comparative analysis of regulatory information and circuits across distant species. <strong>Nature</strong>, 512, 435-6.
<br />
  Dixon et al. (2012) Topological domains in mammalian genomes identified by analysis of chromatin interactions. <strong>Nature</strong>, 485, 376-80.
<br />
  Imakaev et al. (2012) Iterative correction of Hi-C data reveals hallmarks of chromosome organization. <strong>Nature methods</strong>, 9, 999-1003.
<br />
  Kalhor et al. (2011) Genome architectures revealed by tethered chromosome conformation capture and population-based modeling. <strong>Nature biotechnology</strong>, 30, 90-8.
<br />
  Lieberman Aiden et al. (2009) Comprehensive Mapping of Long-Range Interactions Reveals Folding Principles of the Human Genome. <strong>Science</strong>, 326, 289-93.
<br />
  Yaffe and Tanay (2011) Probabilistic modeling of Hi-C contact maps eliminates systematic biases to characterize global chromosomal architecture. <strong>Nature genetics</strong>, 43, 1059-65.

</p>
</div>

<div style="float:left; margin-top:1%"> <p style="font-size:small">HTML5 presentation written in <code>RMarkdown</code> using <code>library("slidify")</code>.</p></div>


