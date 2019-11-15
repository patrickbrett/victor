from sklearn import svm, metrics
from flask import Flask, request, jsonify

def run_svm(train_data, test_data):
    train_data_label_values = list(map(lambda x: x[0], train_data))
    train_data_classifications = list(map(lambda x: x[1], train_data))

    clf = svm.SVC(kernel='linear')

    clf.fit(train_data_label_values, train_data_classifications)

    predictions = clf.predict(test_data)

    print(predictions)

    return predictions


app = Flask(__name__)

@app.route("/", methods = ["POST"])
def hello():
    request_body = request.get_json(force=True)

    train_data = request_body["train_data"]
    test_data = request_body["test_data"]

    predictions = run_svm(train_data, test_data)

    # print("Self Accuracy:", metrics.accuracy_score(train_data, )) # accuracy = number correct / size of dataset
    # print("Self Precision:", metrics.precision_score(y_train, y_train_pred)) # precision = number true positive / number predicted positive (low when predicting things positive that aren't)
    # print("Self Recall:", metrics.recall_score(y_train, y_train_pred)) # recall = number true positive / number actual positive (low when things actually positive but weren't predicted as such)

    # print("Accuracy:", metrics.accuracy_score(test_data, predictions)) # accuracy = number correct / size of dataset
    # print("Precision:", metrics.precision_score(test_data, predictions)) # precision = number true positive / number predicted positive (low when predicting things positive that aren't)
    # print("Recall:", metrics.recall_score(test_data, predictions)) # recall = number true positive / number actual positive (low when things actually positive but weren't predicted as such)

    response = jsonify(predictions.tolist())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
