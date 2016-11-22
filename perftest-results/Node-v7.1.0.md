
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
| traditional | 79196 | 0.079196 | 20.125 |
| nevernull   | 159756 | 0.159756 | 27.734375 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 2.02 | 1.38 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 46619 | 0.046619 | 13.5 |
| nevernull   | 182248 | 0.182248 | 34.328125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 3.91 | 2.54 |



### 200 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 312599 | 0.312599 | 110.140625 |
| nevernull   | 541162 | 0.541162 | 187.15625 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 1.73 | 1.7 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 95187 | 0.095187 | 51.0859375 |
| nevernull   | 411144 | 0.411144 | 247.2265625 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 4.32 | 4.84 |



### 2000 Iterations Result

#### Access Property Nested 3 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 503338 | 0.503338 | 456.5625 |
| nevernull   | 4666947 | 4.666947 | 1768.875 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 9.27 | 3.87 |

#### Access Property Nested 5 Layers Deep
Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 707051 | 0.707051 | 460.4375 |
| nevernull   | 6663872 | 6.663872 | 410.8828125 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 9.42 | 0.89 |

