ExperimentFramework Backend Application
=======================================

Backend application for online experiments.

Installation
------------

To install dependencies, run: 

    npm install

	
Development
-----------

Open the project file in Visual Studio, right-click the **npm** node in the solution explorer and choose **Install missing npm packages**.

Press the **play** button to start the project. Note that you need to use a front-end to actually run the experiment.

To generate the certificates:
    openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout privatekey.pem -out certificate.pem