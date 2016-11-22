
# Performance Test Results for Node v6.0.0
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
| traditional | 1281753 | 1.281753 | 21.765625 |
| nevernull   | 279645 | 0.279645 | 29.34375 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 0.22 | 1.35 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 202867 | 0.202867 | 13.2109375 |
| nevernull   | 175701 | 0.175701 | 36.375 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 0.87 | 2.75 |



### 200 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 900600 | 0.9006 | 113.7421875 |
| nevernull   | 746931 | 0.746931 | 189.1328125 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 0.83 | 1.66 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 75761 | 0.075761 | 50.9921875 |
| nevernull   | 474258 | 0.474258 | 249.5078125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 6.26 | 4.89 |



### 2000 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 281793 | 0.281793 | 456.375 |
| nevernull   | 2900754 | 2.900754 | 1768.6171875 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 10.29 | 3.88 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 923539 | 0.923539 | 460.3671875 |
| nevernull   | 4441302 | 4.441302 | 410.4453125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 4.81 | 0.89 |

