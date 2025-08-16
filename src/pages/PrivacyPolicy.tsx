
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Fractional First is committed to protecting and respecting your personal data. This Privacy Statement sets out the basis on which we will process any personal data we collect from you, or that you provide to us. Please read the following carefully to understand our views and practices regarding your personal data and how we will treat it.
          </p>
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              COLLECTION, PROCESSING AND DISCLOSURE OF PERSONAL DATA
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect Personal Data only when you or your authorized representatives provide it to us, or from publicly available sources. By providing us with your Personal Data, you consent to our collection, processing, transfer, use, disclosure and sharing of your Personal Data for the purposes explained in this Privacy Statement. We will retain control of the use of any Personal Data you disclose to us. Such data shall remain in our possession, or that of data intermediaries acting on our behalf. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Statement. To respond to or process your requests, we may have to disclose your Personal Data to any member of our group or to third parties (such as our service providers and professional advisors). Your Personal Data will not be disclosed to any further parties unless we have obtained your consent or are legally required to do so. You acknowledge that there are inherent risks in the transmission of data over the Internet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              PURPOSES OF USE
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your Personal Data and other information collected may be used by us individually or collectively and may be combined with other information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Administering our website(s);</li>
              <li>Administering our services and/or programs;</li>
              <li>Sending you general business/commercial communications;</li>
              <li>Responding to your enquiries or requests pursuant to your emails, telephone calls, faxes and/or submission of form(s);</li>
              <li>Responding to your queries;</li>
              <li>Responding to and taking follow-up actions on your feedback;</li>
              <li>Seeking your feedback on our business and operational matters;</li>
              <li>Provide third parties with statistical information of our users; or</li>
              <li>For other purposes as reasonably required to provide services to you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              IP ADDRESSES/COOKIES
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use our website, we may collect and store information about your computer (including your IP address, operating system and browser type) for system administration. This is statistical data about browsing actions and patterns of users of our website. This data could possibly lead to your identification, but we, and our data intermediaries, do not use it to do so. Our website uses cookies to distinguish you from other users of our website. This assists in increasing efficiency when you browse our website and also allows us to improve our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              THIRD-PARTY WEBSITES
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may, from time to time, contain links to and from third-party websites. If you follow a link to any of these websites, please note that these websites have their own privacy policies and that we do not accept any responsibility or liability in relation to third-party websites or their policies. Please check their policies before you submit any personal data to these websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              WHERE WE STORE YOUR PERSONAL DATA
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The data that we collect from you may be transferred to, and stored at, locations outside of Singapore. It may also be processed by staff operating outside Singapore who work for us or for one of our service providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              SECURITY
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use reasonable security precautions, including those of our data intermediaries, to protect your Personal Data from unauthorized access, collection, use, disclosure, copying, modification, disposal or similar risks.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              DATA RETENTION
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain Personal Data for as long as necessary for the fulfillment of the purposes for which it was collected or to which you have given your consent, except where otherwise provided by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              ACCESS/CORRECTION OF PERSONAL DATA OR WITHDRAWAL OF CONSENT
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to request access to or correct your Personal Data, or to withdraw consent to Fractional First's use of your Personal Data in accordance with applicable laws. For such requests and/or questions regarding this Privacy Statement, please reach out to us on our 'Contact Us' page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              CHANGES TO THE PRIVACY STATEMENT
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update this Privacy Statement from time to time by posting the updated version on our website(s).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
