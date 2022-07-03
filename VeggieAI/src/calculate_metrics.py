from tkinter.tix import Y_REGION
from sklearn import metrics

# Constants

bean = "bean"
broccoli = "broccoli"
carrot = "carrot"
cauliflower = "cauliflower"
tomato = "tomato"

def append_values_true(value, times):
    for i in range(times):
        y_true.append(value)

def append_values_pred(value, times):
    for i in range(times):
        y_pred.append(value)

# True values
y_true = []

append_values_true(bean, 200)
append_values_true(broccoli, 342)
append_values_true(carrot, 206)
append_values_true(cauliflower, 210)
append_values_true(tomato, 210)

# Predicted values
y_pred = []

append_values_pred(bean, 202)
append_values_pred(broccoli, 335)
append_values_pred(carrot, 207)
append_values_pred(cauliflower, 214)
append_values_pred(tomato, 210)

# Print the confusion matrix
print(metrics.confusion_matrix(y_true, y_pred))

# Print the precision and recall, among other metrics
print(metrics.classification_report(y_true, y_pred, digits=3))