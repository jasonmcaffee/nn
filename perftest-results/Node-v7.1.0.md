
# Performance Test Results for Node v7.1.0
Time and compare traditional safeguarded access to nevernull safeguarded access.

## How Testing is Done
A given test for N iterations is performed by timing access to nested properties.

Access is tested using traditional property safeguarded access, as well as the nevernull safeguarded access.

Each individual property access is timed in nanoseconds, and accumulated into totals.

### Access Property Nested 3 Layers Deep
e.g.
```
//traditional
if(example && example.a5 && example.a5.b){
    result = example.a5.b.c;
}

//nevernull
result = nn(example).a5.b.c();
```

### Access Property Nested 5 Layers Deep
e.g.
```
//traditional
if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
    result = example.a5.b.c.d.e;
}

//nevernull
result = nn(example).a5.b.c.d.e();
```


## Results of Iteration Series


### 20 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 89319 | 0.089319 | 20.125 |
| nevernull   | 184974 | 0.184974 | 27.734375 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 2.07 | 1.38 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 54605 | 0.054605 | 13.5 |
| nevernull   | 233918 | 0.233918 | 34.328125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 4.28 | 2.54 |



### 200 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 522908 | 0.522908 | 106.8515625 |
| nevernull   | 886845 | 0.886845 | 187.15625 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 1.7 | 1.75 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 185310 | 0.18531 | 51.0859375 |
| nevernull   | 708307 | 0.708307 | 249.625 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 3.82 | 4.89 |



### 2000 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 312921 | 0.312921 | 456.5625 |
| nevernull   | 3577654 | 3.577654 | 1768.875 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 11.43 | 3.87 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 470592 | 0.470592 | 460.4375 |
| nevernull   | 4211229 | 4.211229 | 410.8828125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 8.95 | 0.89 |

