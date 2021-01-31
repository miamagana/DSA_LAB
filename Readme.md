# DSA_LAB

To run the project do the following

    docker-compose up

If you want to specify the number of queues you can do it by executing the next command

    docker-compose up --scale queue=5

It will replace the scale flag set in the compose file. By default:

    - 1 client
    - 3 queues
    - 3 workers

For testing purposes, the script test.sh is attached.
