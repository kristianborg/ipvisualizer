package nl.krisborg.ipvisualizer;

import net.firefang.ip2c.Country;
import net.firefang.ip2c.IP2Country;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import java.io.IOException;

/**
 * User: Kris
 * Since: 9-8-13 15:06
 */
@Controller
public class IpConverter {

    @Autowired
    ServletContext ctx;

    private IP2Country ip2c;

    @PostConstruct
    public void init() throws IOException {
        ip2c = new IP2Country(ctx.getRealPath("ip-to-country.bin"), IP2Country.MEMORY_CACHE);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/convert/{ip}/")
    protected @ResponseBody String convertIp(@PathVariable final String ip) throws IOException {
        ip2c = new IP2Country(ctx.getRealPath("ip-to-country.bin"), IP2Country.MEMORY_CACHE);
        final Country c = ip2c.getCountry(ip);
        if (c == null) {
            return null;
        } else {
            return c.getName();
        }
    }
}
