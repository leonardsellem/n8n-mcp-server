# 🎬 Teams Outlook Assistant - Demo Conversation Examples

## 👋 Getting Started

**User**: "Hey, what can you help me with?"

**Assistant**: 
```
🤖 I'm your personal Outlook & Calendar assistant! I can help you with:

📧 **Email Management**
• Summarize unread emails
• Compose and send emails
• Manage drafts

🗓️ **Calendar Management** 
• Schedule meetings
• Create events
• Check availability

Just tell me what you need in plain English!
```

---

## 📧 Email Management Examples

### Email Summary
**User**: "Summarize my unread emails"

**Assistant**: 
```
## 📧 Email Summary

**📩 3 Unread Emails**

**1. 🔴 HIGH PRIORITY - Budget Approval Request**
- From: Sarah Johnson <sarah@company.com>
- Received: 2 hours ago
- Action needed: Review and approve Q4 budget by Friday

**2. 📋 Project Status Update**
- From: Mike Chen <mike@company.com>
- Received: 4 hours ago
- Info: Development is 80% complete, on track for deadline

**3. 📅 Meeting Reminder**
- From: Calendar <calendar@company.com>
- Received: 1 hour ago
- Reminder: Client presentation tomorrow at 2pm

**💡 Recommended Actions:**
- Respond to Sarah's budget request (urgent)
- Acknowledge Mike's update
- Prepare for tomorrow's presentation

---
*What would you like to do next?*

[📬 Get More Details] [✉️ Compose Reply] [🗓️ Schedule Follow-up]
```

### Compose Email
**User**: "Send email to sarah@company.com about the budget approval"

**Assistant**: 
```
## ✉️ Email Sent Successfully!

**To:** sarah@company.com
**Subject:** Budget Approval - Q4 Request

✅ Your email has been sent successfully!

**Preview:**
"Hi Sarah, I've reviewed the Q4 budget request. The numbers look good and align with our strategic goals. I'm approving the budget as submitted. Please proceed with the implementation plan. Thanks for the detailed analysis!"

[📬 View Sent Items] [🔄 Send Another]
```

### Draft Management
**User**: "Show my drafts"

**Assistant**: 
```
## 📝 Your Email Drafts

**1. Q4 Marketing Strategy Review**
   📧 To: marketing-team@company.com
   📅 Modified: Yesterday 3:45 PM

**2. Client Proposal - Phase 2**
   📧 To: client@external.com
   📅 Modified: 2 days ago 10:30 AM

**3. Team Performance Review**
   📧 To: hr@company.com, manager@company.com
   📅 Modified: 1 week ago 4:15 PM

[📤 Send Draft] [✏️ Edit Draft] [🗑️ Delete Draft]
```

---

## 🗓️ Calendar Management Examples

### Schedule Meeting
**User**: "Schedule meeting with John tomorrow at 2pm about the project review"

**Assistant**: 
```
## 🗓️ Calendar Event Created!

**Event:** Project Review with John
**Date:** Tomorrow, March 15, 2024 at 2:00 PM
**Duration:** 1 hour (2:00 PM - 3:00 PM)
**Attendees:** john@company.com

✅ Your calendar event has been created successfully!
📧 Meeting invitations have been sent to all attendees.

[📅 View Calendar] [✏️ Edit Event] [🔄 Create Another]
```

### Complex Scheduling
**User**: "Book a 90-minute strategy session with the marketing team for next Friday afternoon, include Sarah and Mike"

**Assistant**: 
```
## 🗓️ Calendar Event Created!

**Event:** Marketing Strategy Session
**Date:** Friday, March 22, 2024 at 2:00 PM
**Duration:** 90 minutes (2:00 PM - 3:30 PM)
**Attendees:** 
- marketing-team@company.com
- sarah@company.com  
- mike@company.com

**🎯 Meeting Details:**
- Teams meeting link auto-generated
- Agenda: Strategic planning and review
- Location: Conference Room A (Teams hybrid)

✅ Your calendar event has been created successfully!
📧 Meeting invitations sent with Teams link included.

[📅 View Calendar] [✏️ Edit Event] [👥 Add Attendees]
```

---

## 🔄 Advanced Workflows

### Email + Calendar Combo
**User**: "Summarize emails from this week and schedule follow-ups for any urgent items"

**Assistant**: 
```
## 📧 Weekly Email Summary + Follow-ups

**📊 This Week's Email Activity:**
- 47 emails received
- 12 requiring action
- 3 marked urgent

**🔴 Urgent Items Requiring Follow-up:**

**1. Client Contract Review** (Priority: High)
- From: legal@client.com
- Action: Schedule review meeting
- ✅ **Follow-up scheduled:** Monday 10am with legal team

**2. Budget Revision Request** (Priority: High)  
- From: finance@company.com
- Action: Management approval needed
- ✅ **Follow-up scheduled:** Tuesday 3pm with management

**3. Security Audit Findings** (Priority: Medium)
- From: security@company.com  
- Action: Implementation plan required
- ✅ **Follow-up scheduled:** Wednesday 11am with IT team

**📅 3 follow-up meetings created**
**✉️ Summary email sent to assistant@company.com**

[📅 View All Meetings] [📧 View Email Details] [⚙️ Adjust Schedule]
```

### Smart Suggestions
**User**: "I need to reschedule my 3pm meeting tomorrow"

**Assistant**: 
```
## 🔄 Reschedule Event

**📅 Found Meeting Tomorrow at 3:00 PM:**
"Client Presentation - Q4 Results"
- Duration: 1 hour
- Attendees: client@external.com, sarah@company.com
- Location: Conference Room B

**🤖 Smart Suggestions:**
Based on everyone's availability, here are the best alternatives:

**Option 1:** Tomorrow 4:00 PM - 5:00 PM ✅ All Available
**Option 2:** Friday 2:00 PM - 3:00 PM ✅ All Available  
**Option 3:** Monday 10:00 AM - 11:00 AM ⚠️ Sarah has conflict

**💡 Recommendation:** Tomorrow 4:00 PM (keeps it same day, all attendees free)

[🔄 Reschedule to 4pm] [📅 Choose Different Time] [✉️ Ask Attendees]
```

---

## 🎯 Error Handling & Clarification

### Unclear Request
**User**: "Do something with my emails"

**Assistant**: 
```
## ❓ Need More Information

I'd be happy to help with your emails! Could you be more specific about what you'd like me to do?

**Examples:**
- "Summarize unread emails from John"
- "Schedule meeting with Sarah tomorrow at 2pm"  
- "Send draft #2 with proposal.pdf attached"
- "Reschedule tomorrow's 3pm meeting to Thursday"

**Quick Actions:**

[📧 Check Unread Emails] [📝 View Drafts] [🗓️ Check Calendar] [❓ Show Help]
```

### Permission Error
**User**: "Send email to external@client.com"

**Assistant**: 
```
## ⚠️ Permission Required

I don't have permission to send emails on your behalf yet. 

**To fix this:**
1. Go to your Azure app permissions
2. Grant "Mail.Send" permission
3. Provide admin consent
4. Try again

Would you like me to create a draft instead that you can send manually?

[📝 Create Draft] [🔧 Setup Help] [❓ Contact Support]
```

---

## 🌟 Pro Tips

### Efficient Commands
```
✅ Good: "Schedule 30min standup with dev team Monday 9am"
✅ Good: "Summarize emails from Sarah this week"  
✅ Good: "Send draft #2 to client with attachment"

❌ Avoid: "Schedule something"
❌ Avoid: "Check emails"
❌ Avoid: "Do calendar stuff"
```

### Natural Language Tips
- **Be specific** about recipients and dates
- **Include context** like "urgent", "follow-up", "weekly meeting"
- **Mention attachments** by name when relevant
- **Use relative dates** like "tomorrow", "next Monday", "in 2 hours"

### Batch Operations
```
"Summarize unread emails and create follow-up meetings for urgent ones"
"Check calendar conflicts for next week and suggest alternative times"
"Send all drafts marked as ready and schedule presentation prep meeting"
```

---

This demonstrates the natural, conversational interface that makes the Teams Outlook Assistant so powerful for business productivity! 🚀
