
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
| traditional | 127301 | 0.127301 | 21.765625 |
| nevernull   | 212019 | 0.212019 | 29.34375 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 1.67 | 1.35 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 50823 | 0.050823 | 13.2109375 |
| nevernull   | 215150 | 0.21515 | 36.375 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 4.23 | 2.75 |



### 200 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 342602 | 0.342602 | 110.046875 |
| nevernull   | 1007705 | 1.007705 | 189.1328125 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 2.94 | 1.72 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 76916 | 0.076916 | 50.9921875 |
| nevernull   | 498473 | 0.498473 | 249.5078125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 6.48 | 4.89 |



### 2000 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 687340 | 0.68734 | 456.375 |
| nevernull   | 3332849 | 3.332849 | 1768.6171875 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 4.85 | 3.88 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 554919 | 0.554919 | 460.3671875 |
| nevernull   | 4702593 | 4.702593 | 410.4453125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 8.47 | 0.89 |

