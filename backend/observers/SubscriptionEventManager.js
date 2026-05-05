class SubscriptionEventManager {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(eventName, payload) {
    this.observers.forEach((observer) => observer.update(eventName, payload));
  }
}

class AuditLogObserver {
  update(eventName, payload) {
    const safePayload = {
      subscriptionId: payload?.subscriptionId,
      userId: payload?.userId,
      status: payload?.status,
    };
    console.log(`[AUDIT] ${eventName}`, safePayload);
  }
}

const subscriptionEventManager = new SubscriptionEventManager();
subscriptionEventManager.subscribe(new AuditLogObserver());

module.exports = subscriptionEventManager;
