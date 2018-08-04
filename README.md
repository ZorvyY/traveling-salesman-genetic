# traveling-salesman-genetic
> You can see the demo in action [here](https://zorvyy.github.io/traveling-salesman-genetic/index.html).

Solving the traveling salesman problem using a genetic algorithm



In an effort to learn more about (and eventually code) the sweet sweet evolution simulators I see [on youtube](https://www.youtube.com/playlist?list=PLWtM0hW4qU7cyrU3f6zHxI0QFeVUvRkZT), I decided to code a genetic algorithm for myself. Instead of diving headfirst into a crazy physics simulation, however, I decided to learn a bit more about genetic algorithms by trying to approximate a solution to the Traveling Salesman Problem, which apparently can be approximated quite well with a genetic algorithm. If you're unfamiliar, here's how it goes: 

> Given a list of cities and the distances between each pair of cities, what is the shortest possible route that visits each city and returns to the origin city?
>
> -- from [Wikipedia](https://en.wikipedia.org/wiki/Travelling_salesman_problem)

So, the idea is basically to start out with a bunch of randomly generated paths, find which ones give the shortest distance, combine them in different ways, tweaking them randomly and saving the best. Eventually, all of the paths you've stored are better than the initial, and the final path is very near the optimal solution.

If you think about it, a genetic algorithm makes a lot of sense here. Consider two routes that approximately take the same distance. If one is really efficient about once part of the journey, and the other saves distance in a different part, the offspring, so to speak, could inherit the best traits of both and become significantly better.

To my knowledge, each possible path is treated as a _solution_ to the problem of finding the most efficient route. Some will be better than others, and the information about each path must be encoded in a _chromosome,_ which, in this is simplistic case, is just a list of numbers. By randomly combining and mutating (making random changes) to paths, you can progressively save the best path, and keep working towards an optimal solution. To see the demo in action, [click here](https://zorvyy.github.io/traveling-salesman-genetic/index.html).
