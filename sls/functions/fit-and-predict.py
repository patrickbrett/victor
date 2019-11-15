# split into two functions - model fitter and prediction generator - later
# https://stackoverflow.com/questions/15564410/scikit-learn-svm-how-to-save-load-support-vectors/16483943

from sklearn import svm, metrics
from sklearn.model_selection import train_test_split

data = [
    [17, 44, 11, 11, 17],
    [20, 40, 13, 13, 13],
    [24, 24, 24, 27, 0],
    [27, 55, 0, 18, 0],
    [19, 44, 13, 13, 13],
    [33, 42, 0, 8, 17],
    [23, 38, 17, 11, 11],
    [31, 69, 0, 0, 0],
    [13, 53, 0, 7, 27],
    [12, 36, 5, 32, 16],
    [0, 60, 0, 10, 30],
    [17, 51, 0, 13, 19],
    [9, 57, 6, 5, 24],
    [23, 51, 0, 11, 15],
    [18, 59, 0, 6, 18],
    [9, 56, 0, 7, 28],
    [19, 50, 0, 6, 25]
]

target = [
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1
]

# X_train, X_test, y_train, y_test = train_test_split(data, target, test_size=0.3, random_state=5)

# clf = svm.SVC(kernel='linear')
#
# clf.fit(X_train, y_train)
#
# y_train_pred = clf.predict(X_train)
# y_pred = clf.predict(X_test)
#
# print("Self Accuracy:", metrics.accuracy_score(y_train, y_train_pred)) # accuracy = number correct / size of dataset
# print("Self Precision:", metrics.precision_score(y_train, y_train_pred)) # precision = number true positive / number predicted positive (low when predicting things positive that aren't)
# print("Self Recall:", metrics.recall_score(y_train, y_train_pred)) # recall = number true positive / number actual positive (low when things actually positive but weren't predicted as such)

# print("Accuracy:", metrics.accuracy_score(y_test, y_pred)) # accuracy = number correct / size of dataset
# print("Precision:", metrics.precision_score(y_test, y_pred)) # precision = number true positive / number predicted positive (low when predicting things positive that aren't)
# print("Recall:", metrics.recall_score(y_test, y_pred)) # recall = number true positive / number actual positive (low when things actually positive but weren't predicted as such)

# F1 score = 2 * (precision * recall) / (precision + recall)

def handler(event, context):
    print(event.body)

    return {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Origin": "*",
        },
        "body": "Hello world!",
        "isBase64Encoded": False
      }

