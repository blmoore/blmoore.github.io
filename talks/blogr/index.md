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

#bigwriting {
  font-size:x-large;
}

</style>

<!-- Center image on slide -->
<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.min.js"></script>
<script src='http://d3js.org/d3.v3.min.js' type='text/javascript'></script>
<!-- <script src='http://dimplejs.org/dist/dimple.v2.1.0.min.js' type='text/javascript'></script> -->

<script type='text/javascript'>
$(function() {
    $("p:has(img)").addClass('centered');
});
</script>

## I'm going to talk about...

<br />

A couple of examples of R analyses I've done for fun:

  1. Author inflation

  2. Overrated films

<br />

And along the way:

* Fitting R into web frameworks with rCharts and slidify

* Tips for would be "data scientists" / data bloggers

* Getting people to actually read your stuff

--- #solo 

Example 1: Author inflation

--- bg:black

<article class="flexbox vcenter">
<img style="height: inherit;" src="figure/ac.se.png" />
</article>

<aside class="note">
<p>
Found this question on academia stackexchange, lots of votes and discussion.
Talks about the idea of a "golden age" of scientific publishing, where single
authors dominated. Nice image.
</p>
</aside>

---

## Starting point

<ul class="build fade">

<li> Interesting question </li>

<li> No real answers, speculation </li>

<li> Easy to test!!</li>

</ul>

<aside class="note">
<p>
So this was a good starting point for some analysis. Interesting question,
one that I'd actually be interested in answering. The other answers were just
speculation or anecdotal. OWith a couple of very specific examples. Best of all::
very easy to test!
</p>
</aside>

--- 

## Getting some data

<br />

![ropensci](figure/ropensci.png)

<div style="width: 50%; margin-left: auto; margin-right: auto; margin-top: 10%" class="fragment">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/PLOS_logo_2012.svg/500px-PLOS_logo_2012.svg.png" />
</div>

<aside class="note">
<section>
<p>
ROpenSci community of package builders looking to open up science.
Provide lots of handy APIs, in this case the one I was used is for PLOS
journals. (rplos)
</p>
</section>
</aside>

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

<aside class="note">

</aside>

---

## Author count distributions

<br />

![author beanplots](figure/plos1.png)

<aside class="note">
<section>
<p>
Bean plots showing author densities over entire PLOS collection.
With overlaid boxplots showing summary stats for comparison.
</p>
<p>
This is an old plot: Should really be ordered by (e.g.) median, 
never order alphabetically.
</p>
<p>
We can see plos comp biol appears to have the lowest number of authors
while Genetics potentially has the most. Also one extreme outlier:
</p>
</section>
</aside>

--- bg:black

## 270 authors...

![270 authors](figure/270.png)

<aside class="note">
<section>
<p>
Was this BRCA1 paper with 270 authors.
</p>
<p>
Nothing on the 3,000 author ATLAS paper but still quite a few.
</p>
</section>
</aside>

---

## Evidence for author inflation

![lm](figure/plos3.png)

<aside class="note">
<section>
<p>
Back to the original question: are author lists getting longer?

<b>Yes</b>, even in this short timescale of 7 years you can see 
good evidence for author inflation, with journals like PLOS Genetics
adding around half an extra author per year, on averge.
</p>
</section>
</aside>

--- &leftcol

## High impact == high inflation ?

*** =left

![corr with IF](figure/plos4.png)

*** =right

<br />

<u>TODO</u>

> * expand to entire NLM Medline / Pubmed records (>22 mill)

> * Try to get at "good inflation vs. bad inflation"

>   * Relative growth of acknowledgements? (PMC)

<aside class="note">
<section>
<p>
Also interesting to try an "understand" these results a little,
so here I'm comparing the extimate of author inflation with the
journals "Impact Factor", and there seems to be an OK correlation
(can't claim statistical significance with these 6 points).
</p>
<p>
I would like to return to this at some point with the whole of pubmed,
22 million records dating from 1809 so maybe we can see this single author period
transitioning to larger collaborations of today.
</p>
<p>
Good to get at Good V Bad, maybe via acknolwedgments?
</p>
</section>
</aside>

--- #solo 

Example 2: Overrated movies

<aside class="note">
<p>
Second example totally different: <b>pop culture</b>
</p>
</aside>

---

## Starting point

<br />

* Everyone relates to concept of "over/underrated" — but it's inherently subjective

* Maybe a way to quantify this (with, e.g. films) could be:

<br />

> * <b>Critic ratings</b> — subjective ratings

> * <b>Audience ratings</b> — "objective truth" (crowd-sourced, many wrongs principle)

>   * (Wrong way round? Up to you... ) <br /><br />

> * So given this definition of "overrated": <br /><p style="font-size: 1.3em; text-align: center;"><b>Q:</b> What are the most (over|under)rated films?</p>

<aside class="note">
<section>
<p>
Critics are the people doing the overrating and underratings
</p>
<p>
Some people said obviously other way round, critics are right and
together get their ratings about right, it's the audience that's off — 
both fine, just mentally swap the words. Important thing is to state it up front.
</p>
</section>
</aside>

--- 

![rt](figure/rtlogo.png)

They have a REST API! 


```r
library("RCurl")
library("jsonlite")

api.key <- "somelongAPIkey"
rt <- getURI(paste0("http://api.rottentomatoes.com/api/public/v1.0/",
                    "lists/dvds/top_rentals.json?apikey=", api.key, "&limit=50"))

rt <- fromJSON(rt)

title <- rt$movies$title
critics <- rt$movies$ratings$critics_score
audience <- rt$movies$ratings$audience_score
```

<aside class="note">
<p>
REST: representational state transfer: uniform output, e.g. JSON
Stateless requests, same req, same output

Architectural style, not protocol like SOAP
</p>
</aside>

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

--- bg:black

<!--
<div id='chart12666f920d7f' class='rChart dimple'></div>
<script src="js/films.js"></script>
-->

<iframe width='100%' height='100%' src='http://blm.io/movie_embed.html' frameborder='0' scrolling="no"></iframe>

<aside class="note">
<section style="font-size: .8em">
<p>
GOOD: Kurosawa films, Yojimbo, Seven Samurai, Godfather, Goodfellas
</p>
<p>BAD: Age of the dragons:: Moby dick reimagined in fantasy setting; Guardian:: "<b>there's not a whale in sight but this movie blows</b>"; Battlefield Earth:: John travolta stars in L Ron 
Hubbard novel adaptation (most expensive box office losses) (screenwriter apologised to the New York post: <b>The only time I saw the movie was at the premiere, which was one too many times</b>
</p>
</section>
</aside>

--- &colscust

## R background

*** =left

<br />

* <h3>"Hadley"-verse</h3>

* Robust, powerful libraries with strong theoretical underpinnings:

  * <code>ggplot2</code> :: Grammar of graphics (Leland Wilkinson)

  * <code>dplyr</code> :: Grammar of data manipulation

*** =right

<br />

> * <h3>"Ramnath"-verse</h3>

> * Neat hacks that get R talking to various javascript libraries:

>   * <code>rCharts</code> :: js plots from lattice-like syntax

>   * <code>slidify</code> :: HTML/JS/CSS presentations from RMarkdown


--- &colscust

## Interactive charts

*** =left

How we will be doing it:
<br />
<p style="text-align: center;">
R
<br /><br />
&#x25BC;
<br /><br />
ggvis (Rstudio)
<br /><br />
&#x25BC;
<br /><br />
Vega
<br /><br />
&#x25BC;
<br /><br />
D3.js
</p>

*** =right

But currently:
<br />
<p style="text-align: center;">
R
<br /><br />
&#x25BC;
<br /><br />
<b>rCharts</b>
<br /><br />
&#x25BC;
<br /><br />
[ dimple.js, highcharts, NVD3, ... ]
<br /><br />
&#x25BC;
<br /><br />
D3.js
</p>

---

## D3.js

Handles data mapping (often JSON) + acts like jQuery for SVGs.

Very powerful but low-level — basic graphs use the same few elements so 
no need to reinvent wheel for these.

<div id="collision" style="width: 100%; height: 50%; display: block;"></div>
<script src="js/collision.js"></script>

---

## Loads of js plotting libraries

<br />

dimple, NVD3, polycharts, highcharts, ...

<br />

![rCharts](figure/rcharts.png)

<br />

> * Uniform (lattice-style) plotting interface for each of these (and more!)
straight from R

--- &rightcol2 bg:white

## Example: static

*** =left

<br />

<pre><code class="r" style="font-size:.7em;"># load data
d <- read.csv2("Twitter50.txt", sep="\t")

library("ggplot2")

# plot with ggplot
ggplot(d, aes(x=Citations, y=Followers)) + 
  geom_point() + theme_bw() + 
  coord_trans(x="log10", y="log10") +
  scale_x_log10(limits=c(10, 1e6)) +
  scale_y_log10(limits=c(1e4, 1e7))

# save to file from device
ggsave(filename="sciTwitter.svg", 
       width=5, height=5)
</code></pre>

<br />

<p style="font-size:.75em">(Data from @<a href="http://biomickwatson.wordpress.com/2014/09/17/data-from-the-top-50-science-stars-of-twitter/" target="_blank">biomickwatson</a>)</p>

*** =right

<br />

![science stars](figure/sciTwitter.svg)


--- &rightcol2 bg:white

## Example: interactive

*** =left

<br />

<pre><code class="r" style="font-size:.7em;"># load data
d <- read.csv2("Twitter50.txt", sep="\t")

library("rCharts")

# dplot (dimple.js)
i <- dPlot(Followers ~ Citations, 
           data=d, type="bubble",
      groups="Name", height=480, width=520)
      
# axis tweaks
i$yAxis(type = "addLogAxis", overrideMin=1e4)
i$xAxis(type = "addLogAxis", overrideMin=10)

# publish as gist
d$publish()
</code></pre>

*** =right

<iframe width='100%' height="550" src='http://blm.io/stars_embed.html' frameborder='0' scrolling="no"></iframe>

---

## rCharts

<br />

&check; Quick, easy intro to intractive plots for the web

&check; Range of libraries to choose from

&check; Still evolving, new libraries added

&cross; Probably will need to refer to js lib docs for customisation

&cross; Sooner or later will need to edit the js source


---

## Slidify

rCharts for presentations: RMarkdown -> HTML5/CSS/js slide deck

Again lots of output frameworks to choose from: reveal.js, io2012, ...

<br />

Why use these over PowerPoint / LaTeX Beamer?

> * Reproducible R documents via knitr

> * Embed web apps, iframes, SVGs 

> * CSS3 transitions and jQuery animations

> * Participants can follow along with just a browser (+ mobiles, tablets)


--- &colscust

## Slidify

*** =left

### To write a slide

<br />

```
---

## Title 

* Bullet1

  * sub-bullet
  
> 1. This appears

![an image](figure/slidify.png)
```

*** =right

### Gives

<br />

## Title 

* Bullet1

  * sub-bullet
  
> 1. This appears

![an image](figure/slidify.png)

---

<p style="text-align:center; font-size:xx-large; margin-top:20%">
Thanks for your attention
</p>
<br />
<div style="width: 60%; height: auto; margin: 5% auto;">
<p>
People who've helped me out or I've stolen code from:
</p>
<p style="font-size:.8em; text-align:center">
<b>@ramnath_vaidya</b> (rCharts, slidify), @hadley_wickham (dplyr, ggplot2, devtools), 
@kwbroman, @timelyportfolio, <b>StackOverflow</b>,
@mbostock (d3.js), @jkiernander (dimple.js)
</p>
</div>

<div style="float:left; margin-top:1%"> <p style="font-size:small">HTML5 presentation written in <code>RMarkdown</code> using <code>library("slidify")</code>.</p></div>


