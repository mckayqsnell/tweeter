import {SQSClient, SendMessageCommand} from '@aws-sdk/client-sqs';

export class SQSSender {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor(queueUrl: string) {
    this.sqsClient = new SQSClient({});
    this.queueUrl = queueUrl;
  }

  public async sendMessage(message: string) {
    const params = {
      DelaySeconds: 10,
      QueueUrl: this.queueUrl,
      MessageBody: message,
    };
    try {
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
      console.error("Error sending message to the queue: ", err);
      throw err;
    }
  }
}
