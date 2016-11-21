
#### 200 Iterations Result

##### Access Property Nested 3 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b){
    result = example.a5.b.c;
}

//nevernull
result = nn(example).a5.b.c();
```

Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 99442 | 0.099442 | 124.328125 |
| nevernull   | 434919 | 0.434919 | 193.0625 |


Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 4.37 | 1.55 |

##### Access Property Nested 5 Layers Deep
Time and compare traditional safeguarded access to nevernull safeguarded access.

e.g.
```
//traditional
if(example && example.a5 && example.a5.b && example.a5.b.c && example.a5.b.c.d){
    result = example.a5.b.c.d.e;
}

//nevernull
result = nn(example).a5.b.c.d.e();
```

Results Table

|Safeguard Type | nanoseconds | milliseconds| KB memory used |
|:------------: | :-----------: | :-----------: | -----------: |
| traditional | 55631 | 0.055631 | 51.28125 |
| nevernull   | 396666 | 0.396666 | 249.5 |

Comparison Table

|NeverNull is N Times Slower | NeverNull uses N Times More Memory |
|:------- | :--------- |
| 7.13 | 4.87 |

